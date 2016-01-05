'use strict'
var spawn = require('vigour-spawn')
var checkNpmSuccess = require('./checknpmsuccess')
module.exports = exports = function (cwd) {
  return spawn('npm test', { getOutput: true, cwd: cwd })
    .then(checkNpmSuccess)
}
