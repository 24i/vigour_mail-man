var log = require('npmlog')
var manager = require('./src')
var config = require('./config')

manager.init(config)
  .then(() => log.info('repo-manager', 'started'))
  .catch((err) => log.error('repo-manager', err))
