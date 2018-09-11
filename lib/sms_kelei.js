'use strict'

const request = require('request')
const moment = require('moment')
const crypto = require('crypto')
const xml2js = require('xml2js')
const config = require('../config/kelei')

let date = new Date()
let timestamp = moment(date).format('YYYYMMDDHHmmss')

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

    let params = {}
    params['userid'] = config.appid
    params['timestamp'] = timestamp
    params['sign'] = crypto.createHash('md5').update(`${config.appkey}${timestamp}`).digest('hex')
    params['mobile'] = contactNumber
    params['content'] = message
    params['sendTime'] = ''
    params['action'] = 'send'
    params['extno'] = ''

    request.post({
      url: config.apiurl,
      formData: params
    }, (error, response, body) => {
      if (error) {
        reject(error)
        callback(error)
      } else {
        xml2js.parseString(body, (err, result) => {
          if (err) {
            reject(err)
            callback(err)
          } else {
            if (result.returnsms.returnstatus[0] === 'Success') {
              resolve(result.returnsms.message[0])
              callback(result.returnsms.message[0])
            } else {
              reject(result.returnsms.message[0])
              callback(result.returnsms.message[0])
            }
          }
        })
      }
    })
  })
}
