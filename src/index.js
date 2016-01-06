var Github = require('./github')
var Local = require('./local')
var github
var local
var config

module.exports = {
  init: function (cfg) {
    config = cfg
    if (cfg.local) {
      local = new Local(config)
      return local.clone()
    } else {
      github = new Github(config)
      return github.clone()
    }
  },
  update: function () {
    if (config.local) {
      return local.update()
    } else {
      return github.update()
    }
  }
}
