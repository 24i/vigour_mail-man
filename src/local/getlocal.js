'use strict'

var log = require('npmlog')
var fs = require('vigour-fs-promised')
var ncp = require('ncp')

module.exports = exports = function () {
  return fs.readFileAsync(this.config.localIgnore, 'utf8')
    .then((contents) => {
      var ignored = contents.split('\n').filter((item) => {
        return item !== ''
      })
      log.info('packer-server', 'copying from', this.config.localPath, 'to', this.config.path)
      return copyDir(this.config.localPath,
        this.config.path,
        { stopOnErr: true,
          filter: (item) => {
            var unprefixed = item.slice(this.config.localPath.length + 1)
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
      log.info('packer-server', 'copying all files from', this.config.localPath, 'to', this.config.path)
      return copyDir(this.config.localPath, this.config.path, { stopOnErr: true })
    })
}

function copyDir (src, dst, opts) {
  return new Promise(function (resolve, reject) {
    ncp.ncp(src, dst, opts, function (err, files) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
