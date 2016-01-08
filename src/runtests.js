'use strict'

var spawn = require('vigour-spawn')
var checkNpmSuccess = require('./checknpmsuccess')

module.exports = exports = function () {
  return spawn('npm test', { getOutput: true, cwd: this.config.path })
    .then(checkNpmSuccess)
}
