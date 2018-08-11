'use strict'

const chalk = require('chalk')
const http = require('http')
const express = require('express')

const routes = require('./api')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

app.use('/api', routes)

server.listen(port, () => {
    console.log(`${chalk.green('[academy-api]')} server listening on port ${port}`)
})
