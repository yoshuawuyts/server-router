var walk = require('wayfarer/walk')
var assert = require('assert')

module.exports = walkServerRouter

function walkServerRouter (router, cb) {
  assert.strictEqual(typeof router, 'function', 'server-router/walk: router should be a function')
  assert.strictEqual(typeof cb, 'function', 'server-router/walk: cb should be a function')

  router = router._router
  return walk(router, cb)
}
