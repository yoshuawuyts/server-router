const pathname = require('pathname-match')
const urlencode = require('urlencode')
const wayfarer = require('wayfarer')
const methods = require('methods')
const assert = require('assert')

module.exports = serverRouter

// Server router
// str -> fn -> any
function serverRouter (dft, routes) {
  if (Array.isArray(dft)) {
    routes = dft
    dft = '/404'
  }

  assert.equal(typeof dft, 'string', 'server-router: dft should be a string')
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

      router.on(`${computedRoute}/GET`, _wrap(cb))
    } else if (cb && typeof cb === 'object') {
      Object.keys(cb).forEach(function (method) {
        const meth = method.toUpperCase()
        const ok = methods.indexOf(meth)
        assert.ok(ok, `server-router: ${method} is not a valid HTTP method`)
        const computedRoute = route
          ? fullRoute.concat(route).join('/')
          : fullRoute.length ? fullRoute.join('/') : route

        router.on(`${computedRoute}/${meth}`, _wrap(cb[method]))
      })
    }

    if (Array.isArray(children)) {
      walk(children, fullRoute.concat(route))
    }
  })(routes, [])

  return match

  // wrap a callback to swap arguments
  // fn -> (obj, obj, obj) => null
  function _wrap (cb) {
    return (params, req, res) => cb(req, res, params)
  }

  // match a route
  // (obj, obj, [any..]) -> any
  function match (req, res, arg1, arg2, arg3, arg4) {
    const uri = urlencode.decode(pathname(req.url)) + '/' + req.method
    return router(uri, req, res, arg1, arg2, arg3, arg4)
  }
}
