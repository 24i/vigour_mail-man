'use strict'

var log = require('npmlog')

module.exports = exports = function () {
  if (this.config.verbose) {
    log.info('mail-man', 'updating')
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
        console.log('clean', this.config.runClean)
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
        console.log('install', this.config.runInstall)
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
        console.log('test', this.config.runTest)
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
        console.log('build', this.config.runBuild)
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
        console.log('dist', this.config.runDist)
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
          log.info('mail-man', 'new version ready')
          return state
        })
        // handle errors
        .catch((reason) => {
          log.error('mail-man: update failed', reason)
          throw reason
        })
      return prom
    })
}
