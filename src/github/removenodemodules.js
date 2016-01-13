'use strict'

var path = require('path')
var spawn = require('vigour-spawn')

module.exports = exports = function (target) {
  return spawn('find ./node_modules -mindepth 1 -name gaston -prune -o -exec rm -rf {} +', { cwd: path.join(this.config.path, target) })
    .then(() => {
      this.state[target].cleaned = Date.now()
      return this.stateManager.save(this.state)
    })
}
