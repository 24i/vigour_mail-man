'use strict'

var path = require('path')
var log = require('npmlog')
var fs = require('vigour-fs-promised')

module.exports = exports = function (config) {
  this.path = config.path
  this.verbose = config.verbose
}

exports.prototype.filename = 'state.json'

exports.prototype.get = function () {
  if (this.verbose) {
    log.info('mail-man', 'getting state')
  }
  if (this.data) {
    return Promise.resolve(this.data)
  } else {
    return fs.readJSONAsync(path.join(this.path, this.filename))
      .then((state) => {
        this.data = state
        return this.data
      }, (reason) => {
        if (reason.code === 'ENOENT') {
          this.data = {
            one: {},
            two: {}
          }
          return this.data
        } else {
          throw reason
        }
      })
  }
}

exports.prototype.save = function (state) {
  if (this.verbose) {
    log.info('mail-man', 'saving state')
  }
  this.data = state
  return fs.writeJSONAsync(path.join(this.path, this.filename), this.data, { mkdirp: true })
}
