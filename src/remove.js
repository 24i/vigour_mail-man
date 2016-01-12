'use strict'

var path = require('path')
var fs = require('vigour-fs-promised')

module.exports = exports = function (target) {
  var dst = target
    ? path.join(this.config.path, target)
    : this.config.path
  return fs.removeAsync(dst)
}
