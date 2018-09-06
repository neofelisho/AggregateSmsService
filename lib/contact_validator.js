'use strict'

const regex = /^1\d{10}$/

module.exports = function (obj) {
  if (!obj) return false
  if (typeof (obj) === 'string') {
    return obj.match(regex) ? true : false
  }
  if (typeof (obj) === 'number') {
    let s = obj.toString()
    return s.match(regex) ? true : false
  }
  return false
}
