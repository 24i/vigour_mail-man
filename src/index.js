var github = require('./github')
var config

module.exports = {
	init: function(cfg){
		config = cfg
		github.init(config)
		return github.clone()
	},
	update: function(){
		return github.update()
	},
  updateGaston: function(){
    return github.updateGaston()
  }
}

