'use strict'

var btoa = require('btoa')
var StateManager = require('./statemanager')

module.exports = exports = function (cfg) {
  this.config = cfg
  this.config.apiHostname = 'api.github.com'
  this.config.apiHeaders = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'packer-server',
    Authorization: 'Basic ' +
      btoa(this.config.gitUsername +
        ':' +
        this.config.gitPassword)
  }
  this.stateManager = new StateManager(this.config.path)
}

exports.prototype.init = require('./init')
exports.prototype.update = require('./update')
exports.prototype.getCurrent = require('./getcurrent')
exports.prototype.getLatest = require('./getlatest')
exports.prototype.isLatest = require('./islatest')
exports.prototype.remove = require('../remove')
exports.prototype.cloneRepo = require('./clonerepo')
exports.prototype.pullBranch = require('./pullbranch')
exports.prototype.removeNodeModules = require('./removenodemodules')
exports.prototype.npmInstall = require('../npminstall')
exports.prototype.runTests = require('../runtests')
exports.prototype.runBuild = require('../runbuild')
exports.prototype.runDist = require('../rundist')
