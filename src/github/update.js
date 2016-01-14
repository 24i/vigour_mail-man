'use strict'

var log = require('npmlog')

module.exports = exports = function () {
  log.info('mail-man', 'updating')
  var ts = Date.now()
  this.state.updating = ts
  return this.stateManager.save(this.state)
    .then(() => {
      var newTarget = this.state.live === 'one'
        ? 'two'
        : 'one'
      var prom = Promise.resolve()

      // clone
      if (!this.state[newTarget].cloned) {
        prom = prom.then(() => {
          return this.cloneRepo(newTarget)
        })
      }

      // pull
      prom = prom.then(() => {
        if (this.state.updating === ts) {
          return this.cancelUpdate()
        }
        return this.isLatest(newTarget)
      })
        .then((isLatest) => {
          if (this.state.updating === ts) {
            return this.cancelUpdate()
          }
          if (!isLatest) {
            return this.pullBranch(newTarget)
          }
        })
        // clean
        .then(() => {
          if (this.state.updating === ts) {
            return this.cancelUpdate()
          }
          if (this.state[newTarget].installed &&
            this.state[newTarget].pulled > this.state[newTarget].installed) {
            return this.removeNodeModules(newTarget)
          }
        })
        // install
        .then(() => {
          if (this.state.updating === ts) {
            return this.cancelUpdate()
          }
          if (!this.state[newTarget].installed ||
            this.state[newTarget].pulled > this.state[newTarget].installed) {
            return this.npmInstall(newTarget)
          }
        })
        // test
        .then(() => {
          if (this.state.updating === ts) {
            return this.cancelUpdate()
          }
          if (!this.state[newTarget].tested ||
            this.state[newTarget].pulled > this.state[newTarget].tested) {
            return this.runTests(newTarget)
          }
        })
        // build
        .then(() => {
          if (this.state.updating === ts) {
            return this.cancelUpdate()
          }
          if (!this.state[newTarget].built ||
            this.state[newTarget].pulled > this.state[newTarget].built) {
            return this.runBuild(newTarget)
          }
        })
        // dist
        .then(() => {
          if (this.state.updating === ts) {
            return this.cancelUpdate()
          }
          if (!this.state[newTarget].disted ||
            this.state[newTarget].pulled > this.state[newTarget].disted) {
            return this.runDist(newTarget)
          }
        })
        // go live
        .then(() => {
          if (this.state.updating === ts) {
            return this.cancelUpdate()
          }
          this.state.live = newTarget
          this.state[newTarget].live = Date.now()
          return this.stateManager.save(this.state)
        })
        .then(() => {
          log.info('mail-man', 'new version ready')
        })
        // handle errors
        .catch((reason) => {
          log.error('mail-man: update failed', reason)
          throw reason
        })
      return prom
    })
}
