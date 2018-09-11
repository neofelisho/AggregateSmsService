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
        let result = body
        switch (body) {
          case '0':
            result += ':success'
            break
          case '-1':
            result += ':empty username or password'
            break
          case '-2':
            result += ':incorrect username or password'
            break
          case '-3':
            result += ':username was disabled'
            break
          case '-4':
            result += ':empty contact number'
            break
          case '-5':
            result += ':empty message'
            break
          case '-6':
            result += ':over the limit per request'
            break
          case '-7':
            result += ':not enough account balance'
            break
          case '-8':
            result += ':failed to send message'
            break
          case '-9':
            result += ':incorrect contact number'
            break
          case '-10':
            result += ':message contains sensitive word'
            break
          case '-11':
            result += ':invalid account type'
            break
          case '-99':
            result += ':system problem'
            break
          default:
            result += ':unexpected error'
        }
        if (body === '0') {
          resolve(result)
          callback(result)
        } else {
          reject(result)
          callback(result)
        }
      }
    })
  })
}
