'use strict'

const test = require('ava')
let db = null
let config = {
  logging: function () {

  }
}

test.beforeEach(async () => {
  const setupDatabase = require('../')
  db = await setupDatabase(config)
})

test('make it pass', async t => {
  // t.pass()
  console.log(db)
  t.truthy(db.Agent, 'Agent services should exist')
})
