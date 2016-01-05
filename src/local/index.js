var path = require('path')
var log = require('npmlog')
var fs = require('vigour-fs-promised')
var cpr = require('cpr')
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
    config.localPath = (path.isAbsolute(config.local)
      ? config.local
      : path.join(config.cwd, config.local))
    config.localIgnore = path.join(config.localPath, '.gitignore')
    return fs.removeAsync(config.path)
      .then(() => {
        return fs.readFileAsync(config.localIgnore, 'utf8')
      })
      .then((contents) => {
        var ignored = contents.split('\n').filter((item) => {
          return item !== ''
        })
        log.info('packer-server', 'copying from', config.localPath, 'to', config.path)
        return copyDir(config.localPath,
          config.path,
          { filter: (item) => {
            var unprefixed = item.slice(config.localPath.length + 1)
            if (unprefixed.indexOf('.git') === 0) {
              return false
            } else {
              var l = ignored.length
              var found = false
              for (var i = 0; i < l && !found; i += 1) {
                if (unprefixed.indexOf(ignored[i]) === 0) {
                  found = true
                }
              }
              return !found
            }
          }
        })
      }, (reason) => {
        log.info('packer-server', 'copying all files from', config.localPath, 'to', config.path)
        return copyDir(config.localPath, config.path, {})
      })
      .then(() => { return npmInstall(config.path) })
      .then(() => { return runTests(config.path) })
      .then(() => { return runBuild(config.path) })
      .then(() => { return runDist(config.path) })
  },
  update: function () {
    return this.clone()
  }
}

function copyDir (src, dst, opts) {
  return new Promise(function (resolve, reject) {
    cpr.cpr(src, dst, opts, function (err, files) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
