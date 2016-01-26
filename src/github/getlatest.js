'use strict'

var https = require('https')
var log = require('npmlog')
var concat = require('concat-stream')

module.exports = exports = function () {
  return new Promise((resolve, reject) => {
    var options = {
      hostname: this.config.apiHostname,
      path: ['/repos',
        this.config.repo,
        'commits',
        this.config.branch]
          .join('/'),
      headers: this.config.apiHeaders
    }
    if (this.config.verbose) {
      log.info('mail-man', 'getting latest', options)
    }
    var req = https.request(options,
      (res) => {
        var concatenate
        var err
        res.on('error', function (err) {
          err.options = options
          reject(err)
        })
        if (res.statusCode === 401) {
          err = new Error('Git unauthorized')
          err.TODO = 'check username and password'
          err.options = options
          reject(err)
        } else if (res.statusCode === 404) {
          err = new Error('Repo or branch not found')
          err.TODO = 'Check git username and password'
          err.options = options
          reject(err)
        } else {
          concatenate = concat(function (data) {
            var parsed
            try {
              parsed = JSON.parse(data)
            } catch (e) {
              reject(e)
            }
            if (parsed.sha) {
              resolve(parsed.sha)
            } else {
              reject(parsed)
            }
          })
          res.pipe(concatenate)
        }
      })
    req.on('error', function (err) {
      err.options = options
      reject(err)
    })
    req.end()
  })
}
