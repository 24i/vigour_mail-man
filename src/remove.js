'use strict'

var fs = require('vigour-fs-promised')

module.exports = exports = function () {
  return fs.removeAsync(this.config.path)
}
