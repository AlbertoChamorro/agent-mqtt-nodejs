'use strict'

const test = require('ava')
const util = require('util')

const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const auth = require('../auth')
const config = require('../config')
const sign = util.promisify(auth.sign)

let token = null
let sandbox = null
let server = null
let dbStub = null
let AgentStub = {}
let MetricStub = {}

let AgentFixtures = require('./fixtures/agent')

test.beforeEach(async () => {
  token = await sign({ admin: true, username: 'Achamorro' }, config.auth.secret)
  sandbox = sinon.createSandbox()

  dbStub = sandbox.stub()
  dbStub.returns(Promise.resolve({
    Agent: AgentStub,
    Metric: MetricStub
  }))

  const api = proxyquire('../api', {
    'db': dbStub
  })

  server = proxyquire('../server', {
    './api': api
  })

  AgentStub.findConnected = sinon.stub()
  AgentStub.findConnected.returns(Promise.resolve(AgentFixtures.connected))
})

test.afterEach(async () => {
  sandbox && sinon.restore()
})

test.serial.cb('api/agents', t => {
  request(server)
    .get('/api/agents')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      let body = JSON.stringify(res.body)
      let expected = JSON.stringify(AgentFixtures.connected)

      t.deepEqual(body, expected, 'response body should be the expected')
      t.end() // when used test.cb()
    })
})

test.serial.todo('/api/agents - not authorized')

test.serial.todo('/api/agents/:uuid')
test.serial.todo('/api/agents/:uuid - not found')

test.serial.todo('/api/metrics/:uuid')
test.serial.todo('/api/metrics/:uuid - not found')

test.serial.todo('/api/metrics/:uuid/:type')
test.serial.todo('/api/metrics/:uuid/:type - not found')
