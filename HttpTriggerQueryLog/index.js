'use strict'

const azure = require('azure-storage')
const validateContact = require('../lib/contact_validator')
const utility = require('../lib/utility')

module.exports = function (context, req) {
  let contact = req.params.contact
  let platform = req.query.platform
  let take = req.query.take
  let begin = req.query.begin
  let end = req.query.end

  if (!validateContact(contact)) {
    context.res = {
      status: 400,
      body: { message: 'The format of contact is invalid.' }
    }
    context.done()
  }
  let count
  if (take) {
    count = parseInt(take)
    if (isNaN(count)) {
      context.res = {
        status: 400,
        body: { message: 'The format of contact should be number.' }
      }
      context.done()
    }
  } else {
    count = 1
  }

  let tableService = azure.createTableService()
  let qs = `PartitionKey eq '${contact}'`
  if (platform) {
    qs += ` and Platform eq '${platform}'`
  }
  if (begin) {
    qs += ` and RowKey le '${utility.GetRowKey(begin)}'`
  }
  if (end) {
    qs += ` and RowKey ge '${utility.GetRowKey(end)}'`
  }
  let query = new azure.TableQuery().top(count).where(qs)

  tableService.queryEntities(utility.TableName, query, null, (error, result, response) => {
    if (error) {
      context.res = {
        body: { message: 'Query log failed.', data: error }
      }
    } else {
      context.res = {
        body: { message: 'Success.', data: result.entries.map(parseResult) }
      }
    }
    context.done()
  })
}

function parseResult (logEntity) {
  return {
    contact: logEntity.PartitionKey._,
    timestamp: new Date(logEntity.Timestamp._).getTime(),
    message: logEntity.Message._,
    username: logEntity.UserName._,
    platform: logEntity.Platform._,
    result: logEntity.Result._,
    service: logEntity.Service._,
    status: logEntity.Status._
  }
}
