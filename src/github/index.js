// var path = require('path')
var log = require('npmlog')
var fs = require('vigour-fs-promised')
var spawn = require('vigour-spawn')
var config
var pwd

module.exports = {
  init: function (cfg) {
    pwd = process.cwd()
    config = cfg
  },
  clone: function () {
    return checkIfRepoCloned()
      .then(cloneRepo)
      .then(changeDir)
      .then(pullBranch)
      .then(npmInstall)
      .then(runTests)
      .then(runBuild)
      .then(runDist)
      .then(changeDirBack)
  },
  update: function (shouldPull) {
    changeDir()
    return pullBranch(shouldPull)
    .then(removeNodeModules)
    .then(npmInstall)
    .then(runTests)
    .then(runBuild)
    .then(runDist)
    .then(changeDirBack)
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
  return spawn('find ./node_modules -mindepth 1 -name gaston -prune -o -exec rm -rf {} +')
}

var npmInstall = function () {
  return spawn('npm install', { getOutput: true })
    .then(checkNpmSuccess)
}

var runTests = function () {
  return spawn('npm test', { getOutput: true })
    .then(checkNpmSuccess)
}

var runBuild = function () {
  return spawn('npm run build', { getOutput: true })
    .then(checkNpmSuccess)
}

var runDist = function () {
  return spawn('npm run dist', { getOutput: true })
    .then(checkNpmSuccess)
}

var changeDir = function () {
  log.info('$', `cd ${config.path}`)
  return process.chdir(config.path)
}

var changeDirBack = function () {
  log.info('$', `cd ${pwd}`)
  return process.chdir(pwd)
}

var pullBranch = function (shouldPull) {
  var cmd = `git pull origin ${config.branch}`
  return spawn(cmd)
}

function checkNpmSuccess (val) {
  if (val.indexOf('ERR!') > -1) {
    var error = new Error('npm command failed')
    error.logs = val
    throw error
  } else {
    return val
  }
}
