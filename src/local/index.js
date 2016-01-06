'use strict'

var path = require('path')

module.exports = exports = function (cfg) {
  this.config = cfg
  this.config.localPath = (path.isAbsolute(this.config.local)
    ? this.config.local
    : path.join(this.config.cwd, this.config.local))
  this.config.localIgnore = path.join(this.config.localPath, '.gitignore')
}

exports.prototype.getLocal = require('./getlocal')
exports.prototype.remove = require('../remove')
exports.prototype.npmInstall = require('../npminstall')
exports.prototype.runTests = require('../runtests')
exports.prototype.runBuild = require('../runbuild')
exports.prototype.runDist = require('../rundist')

exports.prototype.clone = function () {
  return this.remove()
    .then(this.getLocal.bind(this))
    .then(this.npmInstall.bind(this))
    .then(this.runTests.bind(this))
    .then(this.runBuild.bind(this))
    .then(this.runDist.bind(this))
}

exports.prototype.update = function () {
  return this.clone()
}
