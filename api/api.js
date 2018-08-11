'use strict'

const debug = require('debug')('academy:api:routes')
const express = require('express')
const asyncify = require('express-asyncify')

const api = asyncify(express.Router())
const db = require('db')
const config = require('./config')

let services, Agent, Metric

api.use('*', async (req, res, next) => {
  if (!services) {
    debug('connecting to database in api')
    try {
      services = await db(config.db)
    } catch (err) {
      return next(err)
    }

    Agent = services.Agent
    Metric = services.Metric
  }
  next()
})

api.get('/agents', async (req, res, next) => {
  debug(`A request has come to /agents`)

  let agents = []

  try {
    agents = await Agent.findConnected()
  } catch (err) {
    next(err)
  }
  res.send(agents)
})

api.get('/agent/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  debug(`A request has come to /agent/${uuid}`)

  let agent

  try {
    agent = await Agent.findByUuid(uuid)
  } catch (err) {
    next(err)
  }

  if (!agent) {
    return next(new Error(`Agent not found with uuid ${uuid}`))
  }

  res.send(agent)
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  debug(`A request has come to /metrics/${uuid}`)

  let metrics = []

  try {
    metrics = await Metric.findByAgentUuid(uuid)
  } catch (err) {
    next(err)
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid}`))
  }

  res.send(metrics)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params
  debug(`A request has come to /metrics/${uuid}/${type}`)

  let metrics = []

  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid)
  } catch (err) {
    next(err)
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics (${type}) not found for agent with uuid ${uuid}`))
  }

  res.send(metrics)
})

module.exports = api
