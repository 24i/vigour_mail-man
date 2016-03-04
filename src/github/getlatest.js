'use strict'

var spawn = require('vigour-spawn')

module.exports = exports = function () {
  var cmd = 'git ls-remote ' + this.config.remote + ' ' + this.config.branch
  return spawn(cmd, { getOutput: true })
    .then((val) => {
      return val.split('\t').shift()
    })
}
