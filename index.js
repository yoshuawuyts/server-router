const wayfarer = require('wayfarer')
const methods = require('methods')
const assert = require('assert')
const sliced = require('sliced')

module.exports = serverRouter

// Server router
// str -> fn -> any
function serverRouter (dft) {
  dft = dft || ''

  assert.equal(typeof dft, 'string', 'dft should be a string')

  const router = wayfarer(dft + '/GET')

  match._router = router
  match.on = on
  return match

  // register a route on the router
  // (str, fn|obj) -> null
  function on (route, cbs) {
    assert.equal(typeof route, 'string', 'route should be a string')

    if (typeof cbs === 'function') {
      router.on(route + '/GET', cbs)
    } else {
      Object.keys(cbs).forEach(function (method) {
        const ok = methods.indexOf(method.toUpperCase)
        assert.ok(ok, 'method ' + method + ' is not a valid HTTP method')
        router.on(route + '/' + method.toUpperCase(), cbs[method])
      })
    }
  }

  // match a route
  // [any?] -> any
  function match (req, res) {
    const args = sliced(arguments)

    // create route and remove args head
    args.splice(0, 1)
    args[0] = req.url + '/' + req.method

    return router.apply(null, args)
  }
}
