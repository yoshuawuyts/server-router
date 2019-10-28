# server-router [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Performant [radix-trie](https://en.wikipedia.org/wiki/Radix_tree) router for
streaming servers.

## Usage
```js
var serverRouter = require('server-router')
var http = require('http')

var router = serverRouter({ default: '/404' })

router.route('GET', '/hello', function (req, res, params) {
  res.end('hello world')
})

router.route('PUT', '/hello/:name', function (req, res, params) {
  res.end('hi there ' + params.name)
})

router.route('', '/404', function (req, res, params) {
  res.status = 404
  res.end('404')
})

http.createServer(router.start()).listen()
```

## API
### router = serverRouter(opts)
Create a new router with opts.

### router.route(method|[methods], route, function (req, res, params))
Register a new route with an HTTP method name and a routename. Can register
multiple handlers by passing an array of method names. `params` contains
matched partials from the route.

### router.match(req, res)
Match a route on a router.

### handler = router.start()
Return a function that can be passed directly to `http.createServer()` and
calls `router.match()`.

## Installation
```sh
$ npm install server-router
```

## See Also
- [wayfarer](https://github.com/yoshuawuyts/wayfarer) - vanilla radix-trie
  router
- [nanorouter](https://github.com/yoshuawuyts/nanorouter) - client-side
  radix-trie router

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/server-router.svg?style=flat-square
[3]: https://npmjs.org/package/server-router
[4]: https://img.shields.io/travis/yoshuawuyts/server-router/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/server-router
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/server-router/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/server-router
[8]: http://img.shields.io/npm/dm/server-router.svg?style=flat-square
[9]: https://npmjs.org/package/server-router
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
[12]: https://github.com/yoshuawuyts/wayfarer
