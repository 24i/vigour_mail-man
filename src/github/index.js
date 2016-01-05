'use strict'
var log = require('npmlog')
var fs = require('vigour-fs-promised')
var spawn = require('vigour-spawn')
var npmInstall = require('../npminstall')
var runTests = require('../runtests')
var runBuild = require('../runbuild')
var runDist = require('../rundist')

var config

module.exports = {
  init: function (cfg) {
    config = cfg
  },
  clone: function () {
    return checkIfRepoCloned()
      .then(cloneRepo)
      .then(pullBranch)
      .then(() => { return npmInstall(config.path) })
      .then(() => { return runTests(config.path) })
      .then(() => { return runBuild(config.path) })
      .then(() => { return runDist(config.path) })
  },
  update: function (shouldPull) {
    return pullBranch(shouldPull)
    .then(removeNodeModules)
    .then(() => { return npmInstall(config.path) })
    .then(() => { return runTests(config.path) })
    .then(() => { return runBuild(config.path) })
    .then(() => { return runDist(config.path) })
  }
}

var checkIfRepoCloned = function () {
  log.info('mail-man', 'checking if repo is already cloned')
  return fs.existsAsync(config.path)
}
var cloneRepo = function (isCloned) {
  if (isCloned) {
    return true
  }
  var remote = config.remote
  var branch = config.branch
  var cmd = `git clone --branch=${branch} --depth=1 ${remote} ${config.path}`
  return spawn(cmd)
}

var removeNodeModules = function () {
  return spawn('find ./node_modules -mindepth 1 -name gaston -prune -o -exec rm -rf {} +', config.path)
}

var pullBranch = function (shouldPull) {
  var cmd = `git pull origin ${config.branch}`
  return spawn(cmd, { cwd: config.path })
}
