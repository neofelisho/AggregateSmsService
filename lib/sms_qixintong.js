'use strict'

const soap = require('soap')
const config = require('../config/qixintong')

module.exports = function (contact, message, callback) {
  callback = callback || function () {}
  return new Promise((resolve, reject) => {
    let contactNumber
    if (typeof (contact) === 'number') {
      contactNumber = contact
    } else if (typeof (contact) === 'string') {
      contactNumber = Number(contact)
    } else {
      let err = new Error('Incorrect format: `contact`.')
      reject(err)
      callback(err)
    }

    soap.createClient(config.apiurl, (err, client) => {
      if (err) {
        reject(err)
        callback(err)
      } else {
        let args = {
          'strUserAccount': config.account,
          'strUserPassword': config.password,
          'strTelNumber': contactNumber,
          'strMsg': message,
          'strSplites': ''
        }
        client.SendSMS(args, (err, res) => {
          if (err) {
            reject(err)
            callback(err)
          } else {
            resolve(res)
            callback(res)
          }
        })
      }
    })
  })
}
