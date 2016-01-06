'use strict'

var log = require('npmlog')
var fs = require('vigour-fs-promised')
var cpr = require('cpr')

module.exports = exports = function () {
  return fs.readFileAsync(this.config.localIgnore, 'utf8')
    .then((contents) => {
      var ignored = contents.split('\n').filter((item) => {
        return item !== ''
      })
      log.info('packer-server', 'copying from', this.config.localPath, 'to', this.config.path)
      return copyDir(this.config.localPath,
        this.config.path,
        { filter: (item) => {
          console.log('filter')
          var unprefixed = item.slice(this.config.localPath.length + 1)
          console.log('item', unprefixed)
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
            if (!found) {
              console.log('copying', unprefixed)
            }
            return !found
          }
        }
      })
    }, (reason) => {
      log.info('packer-server', 'copying all files from', this.config.localPath, 'to', this.config.path)
      return copyDir(this.config.localPath, this.config.path, {})
    })
}

function copyDir (src, dst, opts) {
  return new Promise(function (resolve, reject) {
    console.log('calling cpr', src, dst, opts, 'cb')
    cpr.cpr(src, dst, opts, function (err, files) {
      console.log('aha')
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
