
var httpNative   = require('http'),
    httpsNative  = require('https'),
    followRedirects = require('follow-redirects');
var common = require('./common')
var nativeAgents = { http: httpNative, https: httpsNative };

// 定义流式操作
module.exports = {

  // 如果是 'DELETE' 或者 'OPTION'请求的话，需要进行的操作
  deleteLength: function deleteLength(req, res, options) {
    if ((req.method === 'DELETE' || req.method === 'OPTIONS') && !req.headers['content-length']) {
      req.headers['content-length'] = '0'
      delete req.headers['transfer-encoding']
    }
  },

  // 超时处理
  timeout: function timeout(req, res, options) {
    if (options.timeout) {
      req.socket.setTimeout(options.timeout)
    }
  },

  // 对代理的 Header 做处理
  XHeaders: function XHeaders(req, res, options) {
    if (!options.xfwd) return
  },

  stream: function stream(req, res, options, _, server, clb) {
    var agents = options.followRedirects ? followRedirects : nativeAgents;
    var http = agents.http;
    var https = agents.https;
    var outgoing = common.setupOutgoing({}, options, req)
    var proxyReq = (options.target.protocol === 'https:' ? https : http).request(
      outgoing,
      function(proxyRes) {
        if (proxyRes.statusMessage) {
          res.statusCode = proxyRes.statusCode
          res.statusMessage = proxyRes.statusMessage
        } else {
          res.statusCode = proxyRes.statusCode
        }
  
        proxyRes.pipe(res)
      }
    )

    req.pipe(proxyReq)
  }

}