module.exports = function (context, smsMessage) {
    context.log('JavaScript queue trigger function processed work item', smsMessage);
    context.done();
};