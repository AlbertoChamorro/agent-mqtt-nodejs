'use strict'

// const debug = require('debug')('academy:mqtt')
const chalk = require('chalk')
const mosca = require('mosca')
const redis = require('redis')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

const server = new mosca.Server(settings)

server.on('ready', () => {
  console.log(`${chalk.green('[academy-mqtt]')} server is running`)
})
