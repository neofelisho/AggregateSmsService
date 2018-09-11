'use strict'

const azure = require('azure-storage')
const smsSubmail = require('../lib/sms_submail')
const smsQixintong = require('../lib/sms_qixintong')
const smsKeLei = require('../lib/sms_kelei')
const validate = require('../lib/message_validator')
const utility = require('../lib/utility')

const expiredTime = 600000 // 600 seconds
const smsServices = Object.freeze({
  submail: 0, // default service
  kelei: 1,
  qixintong: 2
})

module.exports = SmsService

function SmsService (context, queueMessage) {
  if (validate(queueMessage)) {
    QueryLatestLog(queueMessage.contact)
      .then(service => {
        let serviceName = GetServiceName(service)
        SendMessage(queueMessage.contact, queueMessage.message, service)
          .then(result => {
            let logEntity = getLogEntity(queueMessage, serviceName, 'Success', result)
            context.done(null, logEntity)
          })
          .catch(error => {
            let logEntity = getLogEntity(queueMessage, serviceName, 'Error', error)
            context.done(null, logEntity)
          })
      })
      .catch(err => {
        let logEntity = getLogEntity(queueMessage, '', 'Error', err)
        context.done(null, logEntity)
      })
  } else {
    let logEntity = getLogEntity(queueMessage, '', 'Invalid', queueMessage)
    context.done(null, logEntity)
  }
}

function getLogEntity (queueMessage, service, status, result) {
  let date = new Date()
  let timestamp = date.getTime()
  return {
    PartitionKey: `${queueMessage.contact}`,
    RowKey: `${utility.GetRowKey(timestamp)}`,
    Platform: queueMessage.platform,
    UserName: queueMessage.username,
    Message: queueMessage.message,
    Service: service,
    Status: status,
    Result: result
  }
}

function ChooseSmsService (result) {
  if (result.entries.length === 0) {
    return 0
  }
  let lastSmsService = smsServices[result.entries[0].Service._]
  let timestamp = new Date().getTime()
  let lastTimestamp = new Date(result.entries[0].Timestamp._).getTime()

  if ((timestamp - lastTimestamp) > expiredTime) {
    return lastSmsService
  } else {
    return (lastSmsService + 1) % GetTotalServicesCount()
  }
}

function GetTotalServicesCount () {
  return Object.values(smsServices).length
}

function GetServiceName (value) {
  return Object.keys(smsServices).find(key => smsServices[key] === value)
}

function SendMessage (contact, message, service, callback) {
  callback = callback || function () {}
  switch (service) {
    case smsServices.qixintong:
      return smsQixintong(contact, message, callback)
    case smsServices.submail:
      return smsSubmail(contact, message, callback)
    case smsServices.kelei:
      return smsKeLei(contact, message, callback)
    default:
      throw new Error('Unexpected sms service.')
  }
}

function QueryLatestLog (contact, callback) {
  callback = callback || function () {}
  return new Promise((resolve, reject) => {
    let tableService = azure.createTableService()
    let query = new azure.TableQuery().top(1).where('PartitionKey eq ? and Status ne ?', contact, 'Invalid')
    tableService.queryEntities(utility.TableName, query, null, (error, result, response) => {
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
