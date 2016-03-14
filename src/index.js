'use strict'

var log = require('../logger')
var Github = require('./github')
var github
var config

module.exports = {
  init: function (cfg) {
    config = cfg
    log.info({config: config}, 'config')
    github = new Github(config)
    return github.init()
  },
  update: function () {
    log.info('update requested')
    return github.update()
  }
}
