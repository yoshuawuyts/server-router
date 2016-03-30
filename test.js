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
    return 'foo'
  })

  const r1 = serverRouter()
  r1.on('/foo', r2)

  const server = http.createServer(function (req, res) {
    const foo = r1(req, res)
    t.equal(foo, 'foo', 'returns a value')
  }).listen()
  http.get('http://localhost:' + getPort(server) + '/foo/bar')
})
