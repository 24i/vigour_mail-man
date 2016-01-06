'use strict'

var spawn = require('vigour-spawn')

module.exports = exports = function () {
  return spawn('find ./node_modules -mindepth 1 -name gaston -prune -o -exec rm -rf {} +', this.config.path)
}
