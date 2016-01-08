'use strict'

module.exports = exports = function (cfg) {
  this.config = cfg
}

exports.prototype.checkIfRepoCloned = require('./checkifrepocloned')
exports.prototype.cloneRepo = require('./clonerepo')
exports.prototype.pullBranch = require('./pullbranch')
exports.prototype.removeNodeModules = require('./removenodemodules')
exports.prototype.npmInstall = require('../npminstall')
exports.prototype.runTests = require('../runtests')
exports.prototype.runBuild = require('../runbuild')
exports.prototype.runDist = require('../rundist')

exports.prototype.clone = function () {
  return this.checkIfRepoCloned()
    .then(this.cloneRepo.bind(this))
    .then(this.pullBranch.bind(this))
    .then(this.npmInstall.bind(this))
    .then(this.runTests.bind(this))
    .then(this.runBuild.bind(this))
    .then(this.runDist.bind(this))
}

exports.prototype.update = function (shouldPull) {
  return this.pullBranch(shouldPull)
  .then(this.removeNodeModules.bind(this))
  .then(this.npmInstall.bind(this))
  .then(this.runTests.bind(this))
  .then(this.runBuild.bind(this))
  .then(this.runDist.bind(this))
}
