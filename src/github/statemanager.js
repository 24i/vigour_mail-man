'use strict'

var path = require('path')
var fs = require('vigour-fs-promised')

module.exports = exports = function (pth) {
  this.path = pth
}

exports.prototype.filename = 'state.json'

exports.prototype.get = function () {
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
  this.data = state
  return fs.writeJSONAsync(path.join(this.path, this.filename), this.data)
}
