'use strict'

var getLatest = require('../../src/github/getlatest')

var thisObj = {
  config: {
    remote: 'git@github.com:vigour-io/wrapper.git',
    branch: 'develop'
  }
}

describe('getlatest', function () {
  it('should return a SHA', function () {
    return getLatest.call(thisObj)
      .then((val) => {
        expect(val).to.match(/^[0-9a-f]{40}$/)
      })
  })
})
