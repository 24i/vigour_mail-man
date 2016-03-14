'use strict'

var log = require('../../logger')

module.exports = exports = function () {
  if (this.config.verbose) {
    log.info('updating')
  }
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
        if (this.state.updating !== ts) {
          return this.cancelUpdate()
        }
        return this.isLatest(newTarget)
      })
        .then((isLatest) => {
          if (this.state.updating !== ts) {
            return this.cancelUpdate()
          }
          if (!isLatest) {
            return this.pullBranch(newTarget)
          }
        })

      // clean
      if (this.config.runClean) {
        log.info({runClean: this.config.runClean}, 'clean')
        prom = prom.then(() => {
          if (this.state.updating !== ts) {
            return this.cancelUpdate()
          }
          if (this.state[newTarget].installed &&
            this.state[newTarget].pulled > this.state[newTarget].installed) {
            return this.removeNodeModules(newTarget)
          }
        })
      }

      // install
      if (this.config.runInstall) {
        log.info({runInstall: this.config.runInstall}, 'install')
        prom = prom.then(() => {
          if (this.state.updating !== ts) {
            return this.cancelUpdate()
          }
          if (!this.state[newTarget].installed ||
            this.state[newTarget].pulled > this.state[newTarget].installed) {
            return this.npmInstall(newTarget)
          }
        })
      }

      // test
      if (this.config.runTest) {
        log.info({runTest: this.config.runTest}, 'test')
        prom = prom.then(() => {
          if (this.state.updating !== ts) {
            return this.cancelUpdate()
          }
          if (!this.state[newTarget].tested ||
            this.state[newTarget].pulled > this.state[newTarget].tested) {
            return this.runTests(newTarget)
          }
        })
      }

      // build
      if (this.config.runBuild) {
        log.info({runBuild: this.config.runBuild}, 'build')
        prom = prom.then(() => {
          if (this.state.updating !== ts) {
            return this.cancelUpdate()
          }
          if (!this.state[newTarget].built ||
            this.state[newTarget].pulled > this.state[newTarget].built) {
            return this.runBuild(newTarget)
          }
        })
      }

      // dist
      if (this.config.runDist) {
        log.info({runDist: this.config.runDist}, 'dist')
        prom = prom.then(() => {
          if (this.state.updating !== ts) {
            return this.cancelUpdate()
          }
          if (!this.state[newTarget].disted ||
            this.state[newTarget].pulled > this.state[newTarget].disted) {
            return this.runDist(newTarget)
          }
        })
      }

      // go live
      prom = prom.then(() => {
        if (this.state.updating !== ts) {
          return this.cancelUpdate()
        }
        return this.isLatest(newTarget)
          .then((isLatest) => {
            if (isLatest) {
              this.state.live = newTarget
              this.state[newTarget].live = Date.now()
              return this.stateManager.save(this.state)
            } else {
              return this.update()
            }
          })
      })
        .then((state) => {
          log.info('new version ready')
          return state
        })
        // handle errors
        .catch((err) => {
          log.error({err: err}, 'update failed')
          throw err
        })
      return prom
    })
}
