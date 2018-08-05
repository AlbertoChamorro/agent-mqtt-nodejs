'use strict'

let namespace = 'academy:db:setup'
const debug = require('debug')(namespace)
const db = require('./')

async function setup () {
  const config = {
    database: process.env.DB_NAME || 'academydb',
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.track)
  process.exit(1)
}

setup()
