const pathname = require('pathname-match')
const urlencode = require('urlencode')
const wayfarer = require('wayfarer')
const methods = require('methods')
const assert = require('assert')
const sliced = require('sliced')

module.exports = serverRouter

// Server router
// str -> fn -> any
function serverRouter (dft, opts) {
  if (typeof dft === 'object') {
    opts = dft
    dft = ''
  }

  dft = dft || ''
  opts = opts || {}

  assert.equal(typeof dft, 'string', 'dft should be a string')
  assert.equal(typeof opts, 'object', 'opts should be an object')

  const router = wayfarer(dft + '/GET')

  match._router = router
  match.on = on
  return match

  // register a route on the router
  // (str, fn|obj) -> null
  function on (route, cbs) {
    assert.equal(typeof route, 'string', 'route should be a string')
    route = (route || '').replace(/^\//, '')

    // allow wrapping for custom intrumentation
    if (opts.wrap) cbs = opts.wrap(cbs)

    if (cbs && cbs._router) {
      router.on(route, cbs._router)
    } else if (typeof cbs === 'function') {
      // register a single function as GET
      router.on(route + '/GET', wrap(cbs))
    } else if (typeof cbs === 'object') {
      // register an object of HTTP methods
      Object.keys(cbs).forEach(function (method) {
        const ok = methods.indexOf(method.toUpperCase)
        assert.ok(ok, 'method ' + method + ' is not a valid HTTP method')
        router.on(route + '/' + method.toUpperCase(), wrap(cbs[method]))
      })
    }

    // wrap a callback to pass arguments in different order
    // fn -> fn
    function wrap (cb) {
      return function (params, req, res) {
        const args = sliced(arguments)
        args.splice(0, 3)
        return cb.apply(null, [req, res, params].concat(args))
      }
    }
  }

  // match a route
  // [any?] -> any
  function match (req, res) {
    const args = sliced(arguments)
    args.unshift(urlencode.decode(pathname(req.url)) + '/' + req.method)
    return router.apply(null, args)
  }
}
