'use strict'

var log = require('npmlog')
var Github = require('./github')
var github
var config

module.exports = {
  init: function (cfg) {
    config = cfg
    log.info('mail-man', 'config', config)
    github = new Github(config)
    return github.init()
  },
  update: function () {
    log.info('mail-man', 'update requested')
    return github.update()
  }
}
