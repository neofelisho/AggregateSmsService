'use strict'

const querystring = require('querystring')
const request = require('request')
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

    let params = {
      'user': config.appid,
      'pwd': config.appkey,
      'tel': contactNumber,
      'msg': message
    }
    let qs = querystring.stringify(params)
    request.post({
      url: config.apiurl + qs
    }, (error, response, body) => {
      if (error) {
        reject(error)
        callback(error)
      } else {
        resolve(body)
        callback(body)
      }
    })
  })
}
