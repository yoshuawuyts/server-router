const test = require('tape')
const serverRouter = require('./')

test('should assert input types', function (t) {
  t.plan(1)
  t.throws(serverRouter)
})
