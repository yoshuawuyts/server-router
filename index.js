const pathname = require('pathname-match')
const urlencode = require('urlencode')
const wayfarer = require('wayfarer')
const methods = require('methods')
const assert = require('assert')

module.exports = serverRouter

// Server router
// str -> fn -> any
function serverRouter (opts, routes) {
  if (!routes) {
    routes = opts
    opts = {}
  }

  const dft = opts.default || '/404'
  const shouldThunk = (opts.thunk || opts.thunk === undefined) || false

  assert.equal(typeof opts, 'object', 'server-router: opts should be a object')
  assert.equal(typeof dft, 'string', 'server-router: opts.default should be a string')
  assert.ok(Array.isArray(routes), 'server-router: routes should be an array')

  const router = wayfarer(dft + '/GET')
  match._router = router

  // register tree in router
  // tree[0] is a string, thus a route
  // tree[0] is an array, thus not a route
  // tree[1] is a function or object
    // tree[2] is an array
    // tree[2] is not an array
  // tree[1] is an array
  ;(function walk (tree, fullRoute) {
    if (typeof tree[0] === 'string') {
      var route = tree[0].replace(/^\//, '')
    } else {
      var rootArr = tree[0]
    }

    const children = (Array.isArray(tree[1]))
      ? tree[1]
      : Array.isArray(tree[2]) ? tree[2] : null

    if (rootArr) {
      tree.forEach(function (node) {
        walk(node, fullRoute)
      })
    }

    const cb = (typeof tree[1] === 'function')
      ? tree[1]
      : (typeof tree[1] === 'object')
        ? tree[1]
        : null

    if (cb && typeof cb === 'function') {
      const computedRoute = route
        ? fullRoute.concat(route).join('/')
        : fullRoute.length ? fullRoute.join('/') : route

      const handler = (shouldThunk) ? thunkify(cb) : cb
      router.on(`${computedRoute}/GET`, handler)
    } else if (cb && typeof cb === 'object' && !Array.isArray(cb)) {
      Object.keys(cb).forEach(function (method) {
        assert.ok(methods.indexOf(method.toUpperCase()), `server-router: ${method} is not a valid HTTP method`)

        const computedRoute = route
          ? fullRoute.concat(route).join('/')
          : fullRoute.length ? fullRoute.join('/') : route

        const handler = (shouldThunk) ? thunkify(cb[method]) : cb[method]
        router.on(`${computedRoute}/${method.toUpperCase()}`, handler)
      })
    }

    if (Array.isArray(children)) {
      walk(children, fullRoute.concat(route))
    }
  })(routes, [])

  return match

  // wrap a callback to swap arguments
  // fn -> (obj, obj, obj) => null
  function thunkify (cb) {
    return (params, req, res) => cb(req, res, params)
  }

  // match a route
  // (obj, obj, [any..]) -> any
  function match (req, res, arg1, arg2, arg3, arg4) {
    const uri = urlencode.decode(pathname(req.url)) + '/' + req.method
    return router(uri, req, res, arg1, arg2, arg3, arg4)
  }
}
