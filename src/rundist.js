'use strict'

var spawn = require('vigour-spawn')
var checkNpmSuccess = require('./checknpmsuccess')

module.exports = exports = function () {
  return spawn('npm run dist', { getOutput: true, cwd: this.config.path })
    .then(checkNpmSuccess)
}
