'use strict'

var path = require('path')
var _trimRight = require('lodash/string/trimRight')
var spawn = require('vigour-spawn')

module.exports = exports = function (target) {
  var sha
  return spawn('git rev-parse HEAD', { getOutput: true, cwd: path.join(this.config.path, target) })
    .then((out) => {
      sha = _trimRight(out)
      this.state[target].sha = sha
      return this.stateManager.save(this.state)
    })
    .then(() => {
      return sha
    })
    .catch((reason) => {
      if (reason.code === 'ENOENT') {
        return 'none'
      } else {
        throw reason
      }
    })
}
