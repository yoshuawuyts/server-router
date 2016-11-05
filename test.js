const getPort = require('get-server-port')
const tape = require('tape')
const http = require('http')

const serverRouter = require('./')

tape('server-router', (t) => {
  t.test('should assert input types', (t) => {
    t.plan(2)
    t.throws(serverRouter.bind(null, 1235), /array/)
    t.throws(serverRouter.bind(null, 'hello'), /array/)
  })

  t.test('should register a single callback on GET', (t) => {
    t.plan(1)
    const router = serverRouter([
      ['/foo', function (req, res, params) {
        t.pass('called')
        res.end()
        server.close()
      }]
    ])

    const server = http.createServer(router).listen()
    http.get(`http://localhost:${getPort(server)}/foo`)
  })

  t.test('should register an index path', (t) => {
    t.plan(1)
    const router = serverRouter([
      ['/', (req, res, params) => {
        t.pass('called')
        res.end()
        server.close()
      }]
    ])

    const server = http.createServer(router).listen()
    http.get(`http://localhost:${getPort(server)}`)
  })

  t.test('should register a default path', (t) => {
    t.plan(1)
    const router = serverRouter({ default: '/hey' }, [
      ['/hey', (req, res, params) => {
        t.pass('called')
        res.end()
        server.close()
      }]
    ])

    const server = http.createServer(router).listen()
    http.get(`http://localhost:${getPort(server)}/bar`)
  })

  t.test('should register named callbacks', (t) => {
    t.plan(1)
    const router = serverRouter([
      ['/bar', {
        get: (req, res, params) => {
          t.pass('called')
          res.end()
          server.close()
        }
      }]
    ])

    const server = http.createServer(router).listen()
    http.get(`http://localhost:${getPort(server)}/bar`)
  })

  t.test('should call params', (t) => {
    t.plan(1)
    const router = serverRouter([
      ['/:bar', (req, res, params) => {
        t.equal(params.bar, 'foo', 'params are equal')
        res.end()
        server.close()
      }]
    ])

    const server = http.createServer(router).listen()
    http.get(`http://localhost:${getPort(server)}/foo`)
  })

  t.test('should return a value', (t) => {
    t.plan(1)
    const router = serverRouter([
      ['/foo', (req, res, params) => {
        res.end()
        server.close()
        return 'foo'
      }]
    ])

    const server = http.createServer((req, res) => {
      const ret = router(req, res)
      t.equal(ret, 'foo', 'returns a value')
    }).listen()
    http.get(`http://localhost:${getPort(server)}/foo`)
  })

  t.test('should handle encoded characters', (t) => {
    t.plan(1)
    const router = serverRouter([
      ['/foo bar', (req, res, params) => {
        t.pass('called')
        res.end()
        server.close()
      }]
    ])

    const server = http.createServer(router).listen()
    http.get(`http://localhost:${getPort(server)}/foo%20bar`)
  })
})
