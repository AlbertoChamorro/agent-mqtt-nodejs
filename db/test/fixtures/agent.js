'use strict'

const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture sample',
  username: 'academy',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const agents = [
  agent,
  extend(agent, { id: 2, uuid: 'yyy-yyy-yyw', connected: false, username: 'test' }),
  extend(agent, { id: 3, uuid: 'yyy-yyy-yyx' }),
  extend(agent, { id: 4, uuid: 'yyy-yyy-yyz', username: 'test' })
]

function extend (obj, values) {
  const clone = Object.assign({}, obj)

  return Object.assign(clone, values)
}

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(item => item.connected),
  byUsername: agents.filter(item => item.username === 'test'),
  byUuid: id => agents.filter(item => item.uuid === id).shift(),
  byId: id => agents.filter(item => item.id === id).shift()
}
