'use strict'

const request = require('request')
const config = require('../config/luosimao')

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
      'mobile': contactNumber,
      'message': message
    }
    request.post({
      url: config.apiurl,
      formData: params,
      auth: { user: config.appid, password: config.appkey }
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
