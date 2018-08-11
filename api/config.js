'use strict'

const debug = require('debug')('academy:api:db')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'academydb',
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s)
  },
  auth: {
    secret: process.env.AUTH_SECRET || '_Ac@d3my2018$'
  }
}
