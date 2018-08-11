'use strict'

const debug = require('debug')('academy:api')
const chalk = require('chalk')
const http = require('http')
const express = require('express')

const routes = require('./api')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

app.use('/api', routes)

// Express Error Handler
app.use((err, req, res, next) => {
    debug(`${chalk.red('[error]:')} ${err.message}`)

    if (err.message.match(/not found/)) {
        return res.status(404).send({ error: err.message })
    }

    res.status(500).send({ error: err.message })
})

function handleFatalError () {
    console.error(`${chalk.red('[fatal error]:')} ${err.message}`)
    console.error(err.stack)

    process.exit(1)
}

process.on('onCaughtException', handleFatalError)
process.on('onHandledRejection', handleFatalError)

server.listen(port, () => {
    console.log(`${chalk.green('[academy-api]')} server listening on port ${port}`)
})
