var path = require('path')
var fs = require('vigour-fs-promised')
var log = require('npmlog')
var exec = require('../utils/exec')
var config
var pwd

var github = module.exports = {
	init: function(cfg){
		pwd = process.cwd()
		config = cfg
	},
	clone: function(){
		return checkIfRepoCloned()
			.then(cloneRepo)
      .then(changeDir)
      // .then(github.updateGaston)
      .then(npmInstall)
			.then(runTests)
			.then(runBuild)
			.then(runDist)
      .then(changeDirBack)
	},
	update: function(shouldPull){
		changeDir()
		return pullBranch(shouldPull)
		.then(removeNodeModules)
		.then(npmInstall)
		.then(runTests)
		.then(runBuild)
		.then(runDist)
		.then(changeDirBack)
	},
	updateGaston: function(){
		console.log('$ npm install gaston@latest')
		return exec('npm install gaston@latest', true)
	}
}

var checkIfRepoCloned = function(){
	console.log('checking if repo is already cloned')
	return fs.existsAsync(config.path)
}
var cloneRepo = function(isCloned){
	if(isCloned){
		return true
	}
	var remote = config.remote
	var branch = config.branch
	var cmd = `git clone --branch=${branch} --depth=10 ${remote} ${config.path}`
	console.log(`$ ${cmd}`)
	return exec(cmd, true)
}

var removeNodeModules = function(){
	console.log('$ find ./node_modules -mindepth 1 -name gaston -prune -o -exec rm -rf {} +')
	return exec('find ./node_modules -mindepth 1 -name gaston -prune -o -exec rm -rf {} +', true)
}

var npmInstall = function(){
	console.log('$ npm install --production')
	return exec('npm install --production', true)
}

var runTests = function(){
  console.log('$ npm run test')
	return exec('npm run test', true)
}

var runBuild = function(){
  console.log('$ npm run build')
	return exec('npm run build', true)
}

var runDist = function(){
  console.log('$ npm run dist')
	return exec('npm run dist', true)
}

var changeDir = function(){
	console.log(`$ cd ${config.path}`)
	return process.chdir(config.path)
}

var changeDirBack = function(){
	console.log(`$ cd ${pwd}`)
	return process.chdir(pwd)
}

var pullBranch = function(shouldPull){
	var cmd = `git pull origin ${config.branch}`
	console.log(`$ ${cmd}`)
	return exec(cmd, true)
}

