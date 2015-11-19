var path = require('path')
var fs = require('vigour-fs-promised')
var log = require('npmlog')
var exec = require('../utils/exec')
var config

var github = module.exports = {
	init: function(cfg){
		config = cfg
		console.log(config)
	}, 
	clone: function(){
		return checkIfRepoCloned()
			.then(cloneRepo)
	},
	update: function(){
		changeDir()
		return pullBranch()
		// .then(npmInstall)
		.then(changeDirBack)
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
	var branch = config.distBranch
	var cmd = `git clone --branch=${branch} --depth=10 ${remote}`
	console.log(`$ ${cmd}`)
	return exec(cmd, true)
}

var npmInstall = function(){
	console.log('$ npm update')
	return exec('npm update', true)
}

var changeDir = function(){
	console.log(`$ cd ${config.path}`)
	return process.chdir(config.path)
}

var changeDirBack = function(){
	console.log('$ cd ..')
	return process.chdir('..')
}

var pullBranch = function(shouldPull){
	var cmd = `git pull origin ${config.distBranch}`
	console.log(`$ ${cmd}`)
	return exec(cmd, true)
}

