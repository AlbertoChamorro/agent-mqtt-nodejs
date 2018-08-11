'use strict'

const test = require('ava')
const request = require('supertest')

const server = require('../server')

test.serial.cb('api/agents', t => {
  request(server)
    .get('/api/agents')
    .expect(200)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      let body = res.body
      t.deepEqual(body, {}, 'response body should be the expected')
      t.end() // when used test.cb()
    })
})
