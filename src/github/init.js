'use strict'

var log = require('npmlog')

module.exports = exports = function () {
  return this.stateManager.get()
    .then((state) => {
      this.state = state
      if (this.config.verbose) {
        log.info('mail-man', 'state', state)
      }
      var prom = Promise.resolve()

      if (this.state.live) {
        prom = prom.then(() => {
          return this.isLatest(this.state.live)
        })
          .then((isLatest) => {
            if (!isLatest) {
              return this.update()
            }
          })
      } else {
        prom = prom.then(() => {
          return this.update()
        })
      }
      return prom
    })
    .then(() => {
      return this.state
    })
}
