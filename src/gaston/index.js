var log = require('npmlog')
var spawn = require('vigour-spawn')

var gaston = module.exports = {
  update: function () {
    return gaston.getCurrentVersion()
      .then(function (current) {
        log.info('current', current)
        return gaston.getLatestVersion()
          .then(function (latest) {
            log.info('latest', latest)
            if (current !== latest) {
              return spawn('npm install -g gaston@' + latest)
            } else {
              log.info('We have gaston@latest')
              return true
            }
          })
      })
  },
  getCurrentVersion: function () {
    return spawn('gaston -v', { getOutput: true })
      .then(function (output) {
        log.info('output', output)
        return output.split(' ').pop().replace('\n', '')
      }, function (reason) {
        log.info('gaston', 'is not installed')
        return 'not installed'
      })
  },
  getLatestVersion: function () {
    return spawn('npm view gaston version', { getOutput: true })
      .then(function (output) {
        return output.replace('\n', '')
      })
  }
}
