'use strict'

var path = require('path')
var spawn = require('vigour-spawn')
var checkNpmSuccess = require('./checknpmsuccess')

module.exports = exports = function (target) {
  return spawn('npm run dist', { getOutput: true, cwd: path.join(this.config.path, target) })
    .then(checkNpmSuccess)
    .then(() => {
      this.state[target].disted = Date.now()
      return this.stateManager.save(this.state)
    })
}
