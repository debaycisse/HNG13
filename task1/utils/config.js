const Database = require('better-sqlite3')

const dbName = process.env.NODE_ENV === 'test' ? 
  process.env.TEST_DB : process.env.DB
  
const db = new Database(dbName)
const port = process.env.PORT

const createStringAnalyzer = `
  CREATE TABLE IF NOT EXISTS string_analyzer (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    properties INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (properties) REFERENCES string_analyzer_property(id)
  )
`

const createStringAnalyzerProperty = `
  CREATE TABLE IF NOT EXISTS string_analyzer_property (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    length INTEGER NOT NULL,
    is_palindrome INTEGER NOT NULL,
    unique_characters INTEGER NOT NULL,
    word_count INTEGER NOT NULL,
    sha256_hash TEXT NOT NULL,
    character_frequency_map TEXT NOT NULL
  )
`

db.exec(createStringAnalyzer)
db.exec(createStringAnalyzerProperty)

module.exports = {
  db,
  port
}
