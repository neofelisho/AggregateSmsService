/**
 * API: Send SMS message
 * Method: Http POST
 */

'use strict'

const validate = require('../lib/message_validator')

module.exports = function (context, req) {
  context.log('HTTP trigger function SMS service processed a request.')

  if (validate(req.body)) {
    // ToDo: Check paramters format here
    context.bindings.queueMessage = req.body
    context.res = {
      status: 200,
      body: { code: 0, message: `Success, send ${req.body.message} to ${req.body.contact}.` }
    }
  } else {
    context.res = {
      status: 400,
      body: { code: 1, message: 'Please pass data in the request body.' }
    }
  }
  context.done()
}
