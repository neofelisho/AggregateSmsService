'use strict'

module.exports = function (obj) {
  if (!obj) return false
  if (!obj.platform) return false
  if (!obj.username) return false
  if (!obj.contact) return false
  if (!obj.message) return false
  return true
}
