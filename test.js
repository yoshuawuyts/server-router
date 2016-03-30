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

  router.on('/foo', function (req, res) {
    t.pass('called')
    res.end()
    server.close()
  })

  const server = http.createServer(router).listen()
  http.get('http://localhost:' + getPort(server) + '/foo')
})

test('register an index path', function (t) {
  t.plan(1)
  const router = serverRouter()

  router.on('/', function (req, res) {
    t.pass('called')
    res.end()
    server.close()
  })

  const server = http.createServer(router).listen()
  http.get('http://localhost:' + getPort(server) + '/')
})

test('register a default path', function (t) {
  t.plan(1)
  const router = serverRouter('/404')

  router.on('/404', function (req, res) {
    t.pass('called')
    res.end()
    server.close()
  })

  const server = http.createServer(router).listen()
  http.get('http://localhost:' + getPort(server) + '/foo')
})

test('register multiple callbacks', function (t) {
  t.plan(1)
  const router = serverRouter()
  router.on('/foo', {
    get: function (req, res) {
      t.pass('called')
      res.end()
      server.close()
    }
  })

  const server = http.createServer(router).listen()
  http.get('http://localhost:' + getPort(server) + '/foo')
})

test('should call params', function (t) {
  t.plan(1)
  const router = serverRouter()
  router.on('/:bar', {
    get: function (req, res, params) {
      t.equal(params.bar, 'foo', 'params are equal')
      res.end()
      server.close()
    }
  })

  const server = http.createServer(router).listen()
  http.get('http://localhost:' + getPort(server) + '/foo')
})

test('should return a value', function (t) {
  t.plan(1)
  const router = serverRouter()
  router.on('/foo', {
    get: function (req, res, params) {
      res.end()
      server.close()
      return 'foo'
    }
  })

  const server = http.createServer(function (req, res) {
    const foo = router(req, res)
    t.equal(foo, 'foo', 'returns a value')
  }).listen()
  http.get('http://localhost:' + getPort(server) + '/foo')
})

test('nest routers', function (t) {
  t.plan(1)
  const r2 = serverRouter()
  r2.on('/bar', function (req, res) {
    res.end()
    server.close()
    t.pass('path called')
  })

  const r1 = serverRouter()
  r1.on('/foo', r2)

  const server = http.createServer(r1).listen()
  http.get('http://localhost:' + getPort(server) + '/foo/bar')
})

test('nest routers with partials', function (t) {
  t.plan(5)

  var check1 = false
  var check2 = false
  const r2 = serverRouter()

  r2.on('/', function (req, res) {
    check1 = true
    res.end()
  })

  r2.on('/:sub', function (req, res, params) {
    t.equal(params.sub, 'bar', 'params match')
    check2 = true
    res.end()
  })

  const r1 = serverRouter()
  r1.on('/foo', r2)

  const server = http.createServer(r1).listen()
  const url1 = 'http://localhost:' + getPort(server) + '/foo'
  http.get(url1, function (res) {
    t.equal(res.statusCode, 200, 'status ok')
    t.equal(check1, true, 'first path was called')

    const url2 = 'http://localhost:' + getPort(server) + '/foo/bar'
    http.get(url2, function (res) {
      t.equal(res.statusCode, 200, 'status ok')
      t.equal(check2, true, 'second path was called')
      server.close()
    })
  })
})
