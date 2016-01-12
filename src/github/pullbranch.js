'use strict'

var path = require('path')
var spawn = require('vigour-spawn')

module.exports = exports = function (target) {
  var cmd = `git pull origin ${this.config.branch}`
  return spawn(cmd, { cwd: path.join(this.config.path, target) })
    .then(() => {
      this.state[target].pulled = Date.now()
      return this.stateManager.save(this.state)
    })
}
