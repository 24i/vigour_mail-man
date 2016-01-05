var github = require('./github')
var local = require('./local')
var config

module.exports = {
  init: function (cfg) {
    config = cfg
    if (cfg.local) {
      local.init(config)
      return local.clone()
    } else {
      github.init(config)
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
