# server-router [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Server router.

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

## API
### router = serverRouter(default)
Create a new router with a default path. If no default path is set, the router
will crash if an unknown path is encountered.

### router.on(route, callback|obj)
Attach a callback to a route. Callback can be either a function, which is
registered as `GET` or an object containing functions, with valid HTTP methods
as keys.

### router(req, res, params, ...?)
Match a route on a router. Additional arguments can be passed to the matched
function. Matched routes have a signature of `(req, res, params, ...?)`.

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
