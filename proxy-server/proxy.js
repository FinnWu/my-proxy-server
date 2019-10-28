
var parse_url = require('url').parse
var extend = require('util')._extend
var stream = require('./stream')


function ProxyServer() {
  this.web = function(req, res, options) {
    var requestOptions = options;

    // 对URL进行转化
    ['target'].forEach(function(e) {
      if (typeof requestOptions[e] === 'string') {
        requestOptions[e] = parse_url(requestOptions[e])
      }
    })

    if (!requestOptions.target) {
      return this.emit('error', new Error('Must provide a proper URL as target'))
    }

    stream.stream(req, res, requestOptions, this)

  }
}

module.exports = ProxyServer