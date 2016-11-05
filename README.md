# server-router [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Fast lisp-like router for streaming servers.

## Usage
```js
const serverRouter = require('server-router')
const http = require('http')

const router = serverRouter([
  ['/hello', (req, res) => res.end('hello world')],
  ['/:username', {
    get: (req, res, params) => res.end(`username is ${params.username}`),
    delete: (req, res, params) => res.end(`${params.username} was deleted`)
  }]
])

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

const router = serverRouter([
  ['/index.html', (req, res) => fs.createReadStream('./index.html')],
  ['/404', (req, res) => fromString('404: file not found')]
])

http.createServer((req, res) => router(req, res).pipe(res)).listen()
```

## API
### router = serverRouter(opts, routes)
Create a new router with opts:
- __default:__ (default: `'/404'`) Path to default to when a route is not
  matched. If no default path is set, the router will crash when an unknown
  path is encountered.
- __thunk:__ (default: `true`) Change the way callbacks are wrapped internally.
  Unless you're wrapping `sheet-router` with some custom logic you probably
  don't want to call this.

### value = router(req, res, params, ...?)
Match a route on a router. Additional arguments can be passed to the matched
function. Matched routes have a signature of `(req, res, params, ...?)`. Match
functions can return values, which is useful to create pipelines.

## Installation
```sh
$ npm install server-router
```

## See Also
- [wayfarer](https://github.com/yoshuawuyts/wayfarer) - vanilla radix-trie
  router
- [sheet-router](https://github.com/yoshuawuyts/sheet-router) - client-side
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
