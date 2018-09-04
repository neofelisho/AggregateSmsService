'use strict'

module.exports = function (platform, userName, contact, message, service, status, result) {
  let date = new Date()
  let timestamp = date.getTime()
  return {
    'PartitionKey': `${contact}`,
    'RowKey': 9999999999999 - timestamp,
    'Platform': platform,
    'UserName': userName,
    'Message': message,
    'Service': service,
    'Status': status,
    'Result': result
  }
}
