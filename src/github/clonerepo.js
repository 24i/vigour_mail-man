'use strict'

var spawn = require('vigour-spawn')

module.exports = exports = function (isCloned) {
  if (isCloned) {
    return true
  }
  var cmd = `git clone --branch=${this.config.branch} --depth=1 ${this.config.remote} ${this.config.path}`
  return spawn(cmd)
}
