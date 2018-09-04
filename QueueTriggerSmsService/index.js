'use strict'

const azure = require('azure-storage')
const smsSubmail = require('../lib/sms_submail')
const smsQixintong = require('../lib/sms_qixintong')
const validate = require('../lib/message_validator')
const formatLog = require('../lib/log_formater')

const expiredTime = 600000 // 600 seconds
const logTableName = 'SmsServiceLogs'
const smsServices = Object.freeze({
  qixintong: 0,
  submail: 1
})

module.exports = function (context, queueMessage) {
  let logEntity = {}
  if (validate(queueMessage)) {
    context.log('validation passed.')
    QueryLatestLog(queueMessage.contact)
      .then(service => {
        SendMessage(queueMessage.contact, queueMessage.message, service)
          .then(result => {
            logEntity = formatLog(queueMessage.platform, queueMessage.userName, queueMessage.contact, queueMessage.message, GetServiceName(service), 'Success', result)
          })
          .catch(error => {
            logEntity = formatLog(queueMessage.platform, queueMessage.userName, queueMessage.contact, queueMessage.message, GetServiceName(service), 'Error', error)
          })
      })
      .catch(err => {
        context.log(err)
        logEntity = formatLog(queueMessage.platform, queueMessage.userName, queueMessage.contact, queueMessage.message, '', 'Error', err)
      })
      .then(context.done(null, logEntity))
  } else {
    context.log('validation failed.')
    logEntity = formatLog(queueMessage.platform, queueMessage.userName, queueMessage.contact, queueMessage.message, '', 'Invalid', queueMessage)
    context.done(null, logEntity)
  }
}

function ChooseSmsService (result) {
  if (result.entries.length === 0) {
    return smsServices.qixintong
  }
  let lastSmsService = smsServices[result.entries[0].Service._]
  let timestamp = new Date().getTime()
  let lastTimestamp = new Date(result.entries[0].Timestamp._).getTime()

  if ((timestamp - lastTimestamp) > expiredTime) {
    return lastSmsService
  } else {
    return (lastSmsService + 1) / GetTotalServicesCount()
  }
}

function GetTotalServicesCount () {
  return Object.values(smsServices).length
}

function GetServiceName (value) {
  return Object.keys(smsServices).find(key => smsServices[key] === value).key
}

function SendMessage (contact, message, service, callback) {
  callback = callback || function () {}
  switch (service) {
    case smsServices.qixintong:
      return smsQixintong(contact, message, callback)
    case smsServices.submail:
      return smsSubmail(contact, message, callback)
    default:
      throw new Error('Unexpected sms service.')
  }
}

function QueryLatestLog (contact, callback) {
  callback = callback || function () {}
  return new Promise((resolve, reject) => {
    let tableService = azure.createTableService()
    let query = new azure.TableQuery().top(1).where('PartitionKey eq ? and Status ne ?', contact, 'Invalid')
    tableService.queryEntities(logTableName, query, null, (error, result, response) => {
      if (error) {
        reject(error)
        callback(error)
      } else {
        let service = ChooseSmsService(result)
        resolve(service)
        callback(service)
      }
    })
  })
}
