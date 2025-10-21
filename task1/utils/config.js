const Database = require('better-sqlite3')
const { createTables } = require('./db_helper')

const dbName = process.env.NODE_ENV === 'test' ?
  process.env.TEST_DB : process.env.DB

const db = new Database(dbName)

createTables()

const config = {
  db: db,
  port: process.env.PORT
}

module.exports = config
