'use strict'

var path = require('path')
var _trimRight = require('lodash/string/trimRight')
var spawn = require('vigour-spawn')

module.exports = exports = function (target) {
  return spawn('git rev-parse HEAD', { getOutput: true, cwd: path.join(this.config.path, target) })
    .then((out) => {
      var sha = _trimRight(out)
      this.state[target].sha = sha
      return this.stateManager.save(this.state)
    })
    .then(() => {
      return this.state[target].sha
    })
}
