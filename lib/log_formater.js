'use strict'

module.exports = function (platform, userName, contact, message, service, status) {
  let date = new Date()
  let timestamp = date.getTime()
  return {
    'PartitionKey': `${contact}`,
    'RowKey': timestamp,
    'Platform': platform,
    'UserName': userName,
    'Message': message,
    'Service': service,
    'Status': status
  }
}
