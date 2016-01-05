module.exports = exports = function (val) {
  if (val.indexOf('ERR!') > -1) {
    var error = new Error('npm command failed')
    error.logs = val
    throw error
  } else {
    return val
  }
}
