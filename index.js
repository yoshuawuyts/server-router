var pathname = require('pathname-match')
var urlencode = require('urlencode')
var wayfarer = require('wayfarer')
var assert = require('assert')

module.exports = ServerRouter

function ServerRouter (opts) {
  if (!(this instanceof ServerRouter)) return new ServerRouter(opts)

  opts = opts || {}
  assert.equal(typeof opts, 'object', 'server-router: opts should be type object')
  this._default = opts.default || '/404'
  assert.equal(typeof this._default, 'string', 'server-router: this._default should be type string')
  this._router = wayfarer('/GET/' + this._default.replace(/^[#/]/, ''))
}

ServerRouter.prototype.route = function (method, route, handler) {
  assert.ok(typeof method === 'string' || Array.isArray(method), 'server-router.route: method should be type string or array')
  assert.equal(typeof route, 'string', 'server-router.route: route should be type string')
  assert.equal(typeof handler, 'function', 'server-router.route: handler should be type function')

  if (Array.isArray(method)) {
    var methodRoute = null
    for (var i = 0; i < method.length; i++) {
      methodRoute = method[i] + '/' + route.replace(/^[#/]/, '')
      this._router.on(methodRoute, function (params, req, res) {
        var ctx = { params: params }
        handler(req, res, ctx)
      })
    }
  } else {
    route = method.toUpperCase() + '/' + route.replace(/^[#/]/, '')
    this._router.on(route, function (params, req, res) {
      var ctx = { params: params }
      handler(req, res, ctx)
    })
  }
}

ServerRouter.prototype.match = function (req, res) {
  var uri = urlencode.decode(pathname(req.url)) || '/'
  uri = req.method + uri
  return this._router(uri, req, res)
}

ServerRouter.prototype.start = function () {
  var self = this
  return function (req, res) {
    self.match(req, res)
  }
}
