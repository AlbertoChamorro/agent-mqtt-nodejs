'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const agentFixture = require('./fixtures/agent')

let single = Object.assign({}, agentFixture.single)
let id = 1
let username = 'test'
let uuid = 'yyy-yyy-yyy'
let uuidArgs = {
  where: {
    uuid
  }
}

let connectedArgs = {
  where: {
    connected: true
  }
}

let usernameArgs = {
  where: {
    username,
    connected: true
  }
}

let newAgent = {
  uuid: '123-123-123',
  name: 'testing-acd',
  username: 'test',
  hostname: 'test',
  pid: 0,
  connected: true
}

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
  sandbox = sinon.createSandbox()

  AgentStub = {
    hasMany: sandbox.spy()
  }

  // Model findById Stub
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixture.byId(id)))

  // Model findOne Stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixture.byUuid(uuid)))

  // Model update Stub
  AgentStub.update = sandbox.stub()
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))

  // Model create Stub
  AgentStub.create = sandbox.stub()
  AgentStub.create.withArgs(newAgent).returns(Promise.resolve({
    toJSON () {
      return newAgent
    }
  }))

  // Model findAll stub
  AgentStub.findAll = sandbox.stub()
  AgentStub.findAll.withArgs().returns(Promise.resolve(agentFixture.all))
  AgentStub.findAll.withArgs(connectedArgs).returns(Promise.resolve(agentFixture.connected))
  AgentStub.findAll.withArgs(usernameArgs).returns(Promise.resolve(agentFixture.byUsername))

  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })

  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sinon.restore()
})

test('Agent#Exists Model DB', async t => {
  t.truthy(db.Agent, 'Agent services should exist')
})

test.serial('DB#Setup', t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricStub')

  t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentStub')
})

test.serial('Agent#FindById', async t => {
  let agent = await db.Agent.findById(id)

  t.true(AgentStub.findById.called, 'findById should be called on model')
  t.true(AgentStub.findById.calledOnce, 'findById should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with specified id')

  t.deepEqual(agent, agentFixture.byId(id), 'should be the same')
})

test.serial('Agent#CreateOrUpdate  | user not exists', async t => {
  let agent = await db.Agent.createOrUpdate(single)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne should be called with specified uuid')

  t.true(AgentStub.update.calledOnce, 'update should be called once')

  t.deepEqual(agent, single, 'agent should be the same')
})

test.serial('Agent#CreateOrUpdate  | new user', async t => {
  let agent = await db.Agent.createOrUpdate(newAgent)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
  t.true(AgentStub.findOne.calledWith({
    where: {
      uuid: newAgent.uuid
    }
  }), 'findOne should be called with specified uuid args')

  t.true(AgentStub.create.called, 'create should be called on model')
  t.true(AgentStub.create.calledOnce, 'create should be called once')
  t.true(AgentStub.create.calledWith(newAgent), 'create should be called with specified newAgent')

  t.deepEqual(agent, newAgent, 'agent should be the same')
})

test.serial('Agent#FindByUuid', async t => {
  const agent = await db.Agent.findByUuid(uuid)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne should be called with specified uuidArgs')

  t.deepEqual(agent, agentFixture.byUuid(uuid), 'agent should be the same')
})

test.serial('Agent#FindAll', async t => {
  const agents = await db.Agent.findAll()

  t.true(AgentStub.findAll.called, 'findAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(), 'findAll should be called with specified empty args')

  t.is(agents.length, agentFixture.all.length, 'agents should be the same length')
  t.deepEqual(agents, agentFixture.all, 'agents should be the same')
})

test.serial('Agent#FindConnected', async t => {
  const agents = await db.Agent.findConnected()

  t.true(AgentStub.findAll.called, 'findAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(connectedArgs), 'findAll should be called with specified connectedArgs')

  t.is(agents.length, agentFixture.connected.length, 'agents should be the same length')
  t.deepEqual(agents, agentFixture.connected, 'agents should be the same')
})

test.serial('Agent#FindByUsername', async t => {
  const agents = await db.Agent.findByUsername(username)

  t.true(AgentStub.findAll.called, 'findAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(usernameArgs), 'findAll should be called with specified usernameArgs')

  t.is(agents.length, agentFixture.byUsername.length, 'agents should be the same length')
  t.deepEqual(agents, agentFixture.byUsername, 'agents should be the same')
})
