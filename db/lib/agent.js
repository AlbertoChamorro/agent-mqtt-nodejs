'use strict'

module.exports = function setupAgent (AgentModel) {
  async function createOrUpdate (agent) {
    let condition = {
      where: {
        uuid: agent.uuid
      }
    }

    const existingAgent = await AgentModel.findOne(condition)

    if (existingAgent) {
      const updated = await AgentModel.update(agent, condition)
      return updated ? AgentModel.findOne(condition) : existingAgent
    }

    const created = await AgentModel.create(agent)
    return created.toJSON()
  }

  function findById (id) {
    return AgentModel.findById(id)
  }

  function findByUuid (uuid) {
    return AgentModel.findOne({
      where: {
        uuid
      }
    })
  }

  function findAll () {
    return AgentModel.findAll()
  }

  function findConnected () {
    return AgentModel.findAll({
      where: {
        connected: true
      }
    })
  }

  function findByUsername (username) {
    return AgentModel.findAll({
      where: {
        username,
        connected: true
      }
    })
  }

  return {
    createOrUpdate,
    findById,
    findByUuid,
    findAll,
    findConnected,
    findByUsername
  }
}
