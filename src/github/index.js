// var path = require('path')
var fs = require('vigour-fs-promised')
// var log = require('npmlog')
var gaston = require('../gaston')
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
      .then(gaston.update)
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
  console.log('checking if repo is already cloned')
  return fs.existsAsync(config.path)
}
var cloneRepo = function (isCloned) {
  if (isCloned) {
    return true
  }
  var remote = config.remote
  var branch = config.branch
  var cmd = `git clone --branch=${branch} --depth=10 ${remote} ${config.path}`
  console.log(`$ ${cmd}`)
  return spawn(cmd)
}

var removeNodeModules = function () {
  console.log('$ find ./node_modules -mindepth 1 -name gaston -prune -o -exec rm -rf {} +')
  return spawn('find ./node_modules -mindepth 1 -name gaston -prune -o -exec rm -rf {} +')
}

var npmInstall = function () {
  console.log('$ npm install --production')
  return spawn('npm install --production')
}

var runTests = function () {
  console.log('$ npm run test')
  return spawn('npm run test')
}

var runBuild = function () {
  console.log('$ npm run build')
  return spawn('npm run build')
}

var runDist = function () {
  console.log('$ npm run dist')
  return spawn('npm run dist')
}

var changeDir = function () {
  console.log(`$ cd ${config.path}`)
  return process.chdir(config.path)
}

var changeDirBack = function () {
  console.log(`$ cd ${pwd}`)
  return process.chdir(pwd)
}

var pullBranch = function (shouldPull) {
  var cmd = `git pull origin ${config.branch}`
  console.log(`$ ${cmd}`)
  return spawn(cmd)
}
