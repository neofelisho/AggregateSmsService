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
        let result = {
          code: body
        }
        switch (body) {
          case '0':
            result.msg = ':success'
            break
          case '-1':
            result.msg = ':empty username or password'
            break
          case '-2':
            result.msg = ':incorrect username or password'
            break
          case '-3':
            result.msg = ':username was disabled'
            break
          case '-4':
            result.msg = ':empty contact number'
            break
          case '-5':
            result.msg = ':empty message'
            break
          case '-6':
            result.msg = ':over the limit per request'
            break
          case '-7':
            result.msg = ':not enough account balance'
            break
          case '-8':
            result.msg = ':failed to send message'
            break
          case '-9':
            result.msg = ':incorrect contact number'
            break
          case '-10':
            result.msg = ':message contains sensitive word'
            break
          case '-11':
            result.msg = ':invalid account type'
            break
          case '-99':
            result.msg = ':system problem'
            break
          default:
            result.msg = ':unexpected error'
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
