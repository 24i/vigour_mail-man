'use strict'

module.exports = exports = function (target) {
  var current
  return this.getCurrent(target)
    .then((_current) => {
      current = _current
      return this.getLatest()
    })
    .then(function (latest) {
      return (latest === current)
    })
}
