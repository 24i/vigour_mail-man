'use strict'

var spawn = require('vigour-spawn')

module.exports = exports = function (shouldPull) {
  var cmd = `git pull origin ${this.config.branch}`
  return spawn(cmd, { cwd: this.config.path })
}
