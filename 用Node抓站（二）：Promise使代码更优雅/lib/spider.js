var _ = require('lodash')
var request = require('request')
var parser = require('./parser')
var iconv = require('iconv-lite')
var Promise = require('bluebird')

function spider (opts, callback, handlerMap) {
  if (_.isObject(callback) && _.isUndefined(handlerMap)) {
    handlerMap = callback
    callback = opts.callback
  } else if (_.isString(opts)) {
    opts = {
      url: opts
    }
  }
  if (!_.isFunction(callback)) {
    callback = () => {}
  }
  opts.encoding = null

  return new Promise((resolve, reject) => {
    opts.callback = function (error, response, body) {
      if (!error) {
        body = iconv.decode(body, opts.decoding || 'utf8')
      // 处理json
        try {
          body = JSON.parse(body)
        } catch (e) {
        }
        var data = parser(body, handlerMap)
        callback(error, data, response)
        resolve(data, response)
      } else {
        callback(error, body, response)
        reject(error)
      }
    }
    request(opts)
  })
}
module.exports = spider

