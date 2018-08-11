'use strict'

const debug = require('debug')('academy:api')
const chalk = require('chalk')
const http = require('http')

const asyncify = require('express-asyncify')
const express = require('express')

const routes = require('./api')

const port = process.env.PORT || 3000
const app = asyncify(express())
const server = http.createServer(app)

app.use('/api', routes)

// Express Error Handler
app.use((err, req, res, next) => {
  // console.log(err)
  debug(`${chalk.red('[error]:')} ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({
      error: err.message,
      code: err.status
    })
  }

  if (err.message.match(/authorization/)) {
    return res.status(401).send({
      error: err.message,
      code: err.status
    })
  }

  res.status(500).send({
    error: err.message,
    code: err.status
  })
})

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]:')} ${err.message}`)
  console.error(err.stack)

  process.exit(1)
}

if (!module.parent) {
  process.on('onCaughtException', handleFatalError)
  process.on('onHandledRejection', handleFatalError)

  server.listen(port, () => {
    console.log(`${chalk.green('[academy-api]')} server listening on port ${port}`)
  })
}

module.exports = server
