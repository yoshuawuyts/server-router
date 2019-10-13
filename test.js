var getPort = require('get-server-port')
var tape = require('tape')
var http = require('http')

var serverRouter = require('./')

tape('server-router', function (t) {
  t.test('should assert input types', function (t) {
    t.plan(1)
    t.throws(serverRouter.bind(null, 1235), /object/)
  })

  t.test('should register a single callback on GET', function (t) {
    t.plan(2)
    var a = false
    var b = false

    var router = serverRouter()
    router.route('GET', '/', function (req, res, ctx) {
      t.pass('/ called')
      res.end()
      if (b) server.close()
      else a = true
    })

    router.route('GET', '/foo', function (req, res, ctx) {
      t.pass('/foo called')
      res.end()
      if (a) server.close()
      else b = true
    })

    var server = http.createServer(handler).listen()
    http.get(`http://localhost:${getPort(server)}/foo`)
    http.get(`http://localhost:${getPort(server)}/`)

    function handler (req, res) {
      router.match(req, res)
    }
  })

  t.test('should register a default path', function (t) {
    t.plan(1)

    var router = serverRouter({ default: '/foo' })
    router.route('', '/foo', function (req, res, ctx) {
      t.pass('/foo called')
      res.end()
      server.close()
    })

    var server = http.createServer(handler).listen()
    http.get(`http://localhost:${getPort(server)}/bar`)

    function handler (req, res) {
      router.match(req, res)
    }
  })

  t.test('should create params', function (t) {
    t.plan(1)

    var router = serverRouter({ default: '/foo' })
    router.route('GET', '/foo/:bar', function (req, res, params) {
      t.equal(params.bar, 'hi-there')
      res.end()
      server.close()
    })

    var server = http.createServer(handler).listen()
    http.get(`http://localhost:${getPort(server)}/foo/hi-there`)

    function handler (req, res) {
      router.match(req, res)
    }
  })

  t.test('should handle encoded characters', function (t) {
    t.plan(1)

    var router = serverRouter({ default: '/foo' })
    router.route('GET', '/foo bar', function (req, res, ctx) {
      t.pass('called')
      res.end()
      server.close()
    })

    var server = http.createServer(handler).listen()
    http.get(`http://localhost:${getPort(server)}/foo%20bar`)

    function handler (req, res) {
      router.match(req, res)
    }
  })

  t.test('should handle routes when calling start', function (t) {
    t.plan(1)

    var router = serverRouter()

    router.route('GET', '/hello', function (req, res, ctx) {
      t.pass('/hello called')
      res.end()
      server.close()
    })

    var server = http.createServer(router.start()).listen()
    http.get(`http://localhost:${getPort(server)}/hello`)
  })

  t.test('should handle an array of methods', function (t) {
    t.plan(5)

    var router = serverRouter()
    router.route(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/foo', function (req, res, ctx) {
      t.pass(req.method + ' called')
      res.end()
    })

    var server = http.createServer(handler).listen()
    makeRequest('GET', '/foo', function () {
      makeRequest('POST', '/foo', function () {
        makeRequest('PUT', '/foo', function () {
          makeRequest('DELETE', '/foo', function () {
            makeRequest('PATCH', '/foo')
          })
        })
      })
    })

    function makeRequest (method, route, cb) {
      var req = http.request({ port: getPort(server), method: method, path: route }, function (res) {
        res.on('error', function (err) {
          t.error(err)
        })
      })
      req.on('error', function (err) {
        t.error(err)
      })
      req.end(function () {
        if (cb) cb()
        else server.close()
      })
    }
    function handler (req, res) {
      router.match(req, res)
    }
  })
})
