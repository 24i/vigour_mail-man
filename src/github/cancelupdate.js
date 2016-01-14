'use strict'

module.exports = exports = function () {
  var error = new Error('update canceled')
  error.reason = 'another update came in'
  throw error
}
