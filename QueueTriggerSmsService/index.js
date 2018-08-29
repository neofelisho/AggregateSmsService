'use strict'

module.exports = function (context, queueMessage) {
  let contact = queueMessage.contact
  let message = queueMessage.message

  // check latest log
  // case(no log): use default sms service
  // case(re-try): use another sms service
  // case(success): use same sms service
  context.log('JavaScript queue trigger function processed work item', contact + ':' + message)
  context.done()
}
