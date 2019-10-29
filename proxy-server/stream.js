
var httpNative   = require('http'),
    httpsNative  = require('https'),
    followRedirects = require('follow-redirects');
var common = require('./common')
var nativeAgents = { http: httpNative, https: httpsNative };

// 定义流式操作
module.exports = {
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