var Github = require('./github')
var github
var config

module.exports = {
  init: function (cfg) {
    config = cfg
    github = new Github(config)
    return github.clone()
  },
  update: function () {
    return github.update()
  }
}
