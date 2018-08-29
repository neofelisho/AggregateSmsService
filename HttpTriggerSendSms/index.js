'use strict'

module.exports = function (context, req) {
  context.log('HTTP trigger function SMS service processed a request.')

  let msg = ''
  if (req.body) {
    let contact = req.body.contact
    let message = req.body.message
    if (contact && message) {
      try {
      // put data into storage queue

      } catch (err) {

      }
      context.res = {
        status: 200,
        body: `Success, send ${message} to ${contact}.`
      }
      context.done()
    }
    if (!contact) msg += 'Contact number is missing.'
    if (!message) msg += 'Message content is missing.'
  } else {
    msg = 'Please pass data in the request body.'
  }
  context.res = {
    status: 400,
    body: msg
  }
  context.done()
}
