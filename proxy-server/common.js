
var extend = require('util')._extend
var url = require('url')

var common = exports

common.setupOutgoing = function(outgoing, options, req, forward) {
  outgoing.port = options[forward || 'target'].port;

  ['host', 'hostname', 'socketPath', 'pfx', 'key', 'passphrase', 'cert', 'ca', 'ciphers', 'secureProtocol'].forEach(function(e) {
    outgoing[e] = options[forward || 'target'][e]
  })

  outgoing.method = options.method || req.method
  outgoing.headers = extend({}, req.headers)

  if (options.headers) {
    extend(outgoing.headers, options.headers)
  }

  if (options.auth) {
    outgoing.auth = options.auth
  }

  if (options.ca) {
    outgoing.ca = options.ca
  }

  outgoing.agent = options.agent || false
  outgoing.localAddress = options.localAddress

  if (!outgoing.agent) {
    outgoing.headers = outgoing.headers || {}
    if (typeof outgoing.headers.connection !== 'string') {
      outgoing.headers.connection = 'close'
    }
  }

  var outgoingPath = !options.toProxy ? (url.parse(req.url).path || '') : req.url
  outgoing.path = outgoingPath

  return outgoing
}

