var github = require('./github')
var config

module.exports = {
	init: function(cfg){
		config = cfg
		github.init(config)
		return github.clone()
			.then(() => github.update(false))
	},
	update: function(){
		return github.update()
	}
}

