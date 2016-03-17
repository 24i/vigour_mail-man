var log = require('./logger')
var manager = require('./src')
var config = require('./config')

manager.init(config)
  .then(() => log.info('started'))
  .catch((err) => log.error({err: err}, 'init error'))
