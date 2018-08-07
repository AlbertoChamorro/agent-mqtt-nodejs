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

  return {
    createOrUpdate,
    findById
  }
}
