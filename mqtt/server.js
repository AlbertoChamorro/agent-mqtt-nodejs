'use strict'

const debug = require('debug')('academy:mqtt')
const chalk = require('chalk')
const mosca = require('mosca')
const redis = require('redis')

// module db
const dbContext = require('db')

const config = {
  database: process.env.DB_NAME || 'academydb',
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: s => debug(s)
}

let Agent, Metric = null

const backend = {
  type: 'redis',
  redis,
  port: 6379,
  return_buffers: true // to handle binary payloads
}

const settings = {
  port: 1883,
  backend
}

const server = new mosca.Server(settings)

server.on('clientConnected', client => {
  debug(`Client Connected: ${client.id}`)
})

server.on('clientDisconnected', client => {
  debug(`Client Disconnected: ${client.id}`)
})

// npx mqtt -v
// mqtt pub -t 'agent/message' -h localhost -m 'hello academy app'
// -t: topic || -m: message
server.on('published', (packet, client) => {
  debug(`Received: ${packet.topic}`)
  debug(`Payload: ${packet.payload}`)
})

server.on('ready', async () => {
  const services = await dbContext(config).catch(handleFatalError)
  Agent = services.Agent
  Metric = services.Metric
  console.log(`${chalk.green('[academy-mqtt]')} server is running`)
})

server.on('error', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
