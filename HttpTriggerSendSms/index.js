/**
 * API: Send SMS message
 * Method: Http POST
 */

'use strict'

const logFormater = require('../lib/log_formater')

module.exports = function (context, req) {
  context.log('HTTP trigger function SMS service processed a request.')

  if (req.body && req.body.platform && req.body.username && req.body.contact && req.body.message) {
    // ToDo: Check paramters format here
    context.bindings.tableBinding = logFormater(req.body.platform, req.body.username, req.body.contact, req.body.message, '', 0)
    context.bindings.queueMessage = req.body.contact
    context.res = {
      status: 200,
      body: `Success, send ${req.body.message} to ${req.body.contact}.`
    }
  } else {
    context.res = {
      status: 400,
      body: 'Please pass data in the request body.'
    }
  }
  context.done()
}
