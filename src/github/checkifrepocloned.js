'use strict'

var log = require('npmlog')
var fs = require('vigour-fs-promised')

module.exports = exports = function () {
  log.info('mail-man', 'checking if repo is already cloned')
  return fs.existsAsync(this.config.path)
}
