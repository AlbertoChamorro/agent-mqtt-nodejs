'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

let sandbox = null
let MetricStub = {
  belongsTo: sinon.spy()
}
let AgentStub = null

let config = {
  logging: function () {}
}
let db = null

test.beforeEach(async () => {
  sandbox = sinon.sandbox.create()

  AgentStub = {
    hasMany: sandbox.spy()
  }

  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })

  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sinon.restore()
})

test('make it pass', async t => {
  t.truthy(db.Agent, 'Agent services should exist')
})

test.serial('Setup db', async t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricStub')

  t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentStub')
})
