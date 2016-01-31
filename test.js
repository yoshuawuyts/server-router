const getPort = require('get-server-port')
const test = require('tape')
const http = require('http')

const serverRouter = require('./')

test('should assert input types', function (t) {
  t.plan(2)
  t.throws(serverRouter.bind(null, {}))
  t.doesNotThrow(serverRouter.bind(null))
})

test('register a single callback on GET', function (t) {
  t.plan(1)
  const router = serverRouter()

  router.on('/foo', function () {
    t.pass('called')
  })

  const server = http.createServer(function (req, res) {
    router(req, res)
    res.end()
    server.close()
  }).listen()

  http.get('http://localhost:' + getPort(server) + '/foo')
})

test('register a default path', function (t) {
  t.plan(1)
  const router = serverRouter('/404')

  router.on('/404', function () {
    t.pass('called')
  })

  const server = http.createServer(function (req, res) {
    router(req, res)
    res.end()
    server.close()
  }).listen()

  http.get('http://localhost:' + getPort(server) + '/foo')
})
