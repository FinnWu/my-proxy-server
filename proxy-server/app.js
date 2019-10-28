var http = require('http')

var Proxy = require('./proxy')

var proxyServer = new Proxy()

var app = http.createServer((req, res) => {
  proxyServer.web(req, res, { target: 'http://localhost:3000' })
})

app.listen(6050, () => {
  console.log('server is running in 6050');
})