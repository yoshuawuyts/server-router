const walk = require('wayfarer/walk')
const assert = require('assert')

module.exports = walkServerRouter

function walkServerRouter (router, cb) {
  assert.equal(typeof router, 'function', 'server-router/walk: router should be a function')
  assert.equal(typeof cb, 'function', 'server-router/walk: cb should be a function')

  router = router._router
  return walk(router, cb)
}
