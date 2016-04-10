# server-router [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Server router is a fast, modular server-side router. It's tuned for performance
by statically declaring routes in a [radix-trie][12]. Can return values which
makes it ideal for middleware pipelines using streams.

## Usage
```js
const serverRouter = require('server-router')
const http = require('http')

const router = serverRouter('/404')
router.on('/hello', function (req, res) {
  res.end('hello world')
})

router.on('/:username', {
  get: function (req, res, params) {
    res.end('username is ' + params.username)
  },
  delete: function (req, res, params) {
    res.end('username ' + params.username + 'will be deleted')
  }
})

http.createServer(router).listen()
```

## Usage with streams
Server-router can return values, which makes it ideal for Node streams,
pull-streams or other eventual values:
```js
const serverRouter = require('server-router')
const fromString = require('from2-string')
const http = require('http')
const fs = require('fs')

const router = serverRouter('/404')
router.on('/index.html', function (req, res) {
  return fs.createReadStream(./index.hmlt)
})

router.on('/404', function (req, res) {
  res.statusCode = 404
  return fromString('File not found')
})

http.createServer(function (req, res) {
  router(req, res).pipe(res)
}).listen()
```

## Nesting routers
Applications generally span multiple files. Each individual part of your
application has its own set of routes and concerns. In most other routers
nested routes can become quite intransparent; hiding all routes in deeply
nested files. Server-router can nest routers, which provides a better sense of
navigation in the code. An example:
```js
const serverRouter = require('server-router')
const http = require('http')

const mainRouter = serverRouter()
const torrentRouter = serverRouter()
const assetRouter = serverRouter()

torrentRouter.on('/', /* list all torrents */)
torrentRouter.on('/:torrent', /* return data for 1 torrent */)

assetRouter.on('/', /* return index.html */)
assetRouter.on('/bundle.js', /* return JS */)
assetRouter.on('/bundle.css', /* return CSS */)

mainRouter.on('/torrent', torrentRouter)
mainRouter.on('/', assetRouter)

http.createServer(mainRouter).listen()
```
Now all request to `/torrent` will be passed to `torrentRouter`, and all
requests to `/` will be handled by the `assetRouter`. Both of these can live in
separate files, but at the top level it's clear which routes are handled by
which handlers. Server-router supports arbitrary nesting, so go ahead and
structure your files exactly as you like.

## API
### router = serverRouter(default)
Create a new router with a default path. If no default path is set, the router
will crash if an unknown path is encountered.

### router.on(route, callback|obj)
Attach a callback to a route. Callback can be either a function, which is
registered as `GET` or an object containing functions, with valid HTTP methods
as keys.

### value = router(req, res, params, ...?)
Match a route on a router. Additional arguments can be passed to the matched
function. Matched routes have a signature of `(req, res, params, ...?)`. Match
functions can return values, which is useful to create pipelines.

## Installation
```sh
$ npm install server-router
```

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
