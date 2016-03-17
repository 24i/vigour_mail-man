'use strict'

var log = require('../../logger')

module.exports = exports = function () {
  if (this.config.verbose) {
    log.info('canceling update')
  }
  var error = new Error('update canceled')
  error.reason = 'another update came in'
  throw error
}
