/**
 * API: Send SMS message
 * Method: Http POST
 */

'use strict'

module.exports = function (context, req) {
  context.log('HTTP trigger function SMS service processed a request.')

  if (req.body && req.body.contact && req.body.message) {
    // ToDo: Check paramters format here
    context.bindings.queueMessage = JSON.stringify(req.body)
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
