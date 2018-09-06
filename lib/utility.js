'use strict'

module.exports.TableName = 'SmsServiceLogs'

module.exports.GetRowKey = function (obj) {
  if (typeof (obj) === 'number') {
    return 9999999999999 - obj
  }
  if (typeof (obj) === 'string') {
    return 9999999999999 - parseInt(obj)
  }
  throw new Error(`Unexpected parameter type of 'RowKey': ${obj}.`)
}
