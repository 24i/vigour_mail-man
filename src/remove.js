'use strict'

var path = require('path')
var log = require('../logger')
var fs = require('vigour-fs-promised')

module.exports = exports = function (target) {
  if (this.config.verbose) {
    log.info('removing')
  }
  var dst = target
    ? path.join(this.config.path, target)
    : this.config.path
  return fs.removeAsync(dst)
}
