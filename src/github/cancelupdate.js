'use strict'

var log = require('npmlog')

module.exports = exports = function () {
  if (this.config.verbose) {
    log.info('mail-man', 'canceling update')
  }
  var error = new Error('update canceled')
  error.reason = 'another update came in'
  throw error
}
