'use strict'

var path = require('path')
var spawn = require('vigour-spawn')

module.exports = exports = function (target) {
  return this.remove(target)
    .then(() => {
      return spawn(`git clone --branch=${this.config.branch} --depth=1 ${this.config.remote} ${path.join(this.config.path, target)}`)
    })
    .then((val) => {
      this.state[target].cloned = Date.now()
      this.stateManager.save(this.state)
    })
}
