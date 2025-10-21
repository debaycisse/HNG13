const { db } = require('./config')
const {

} = require('./util_helper')

const createStringAnalyzer = `
  CREATE TABLE IF NOT EXISTS string_analyzer (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    properties INTEGER NOT NULL,
    created_at DATE NOT NULL,
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

const findString = (stringId) => {
  const stmt = db.prepare(`
    SELECT sa.*, sap.*
    FROM string_analyzer sa
    JOIN string_analyzer_property sap ON sa.properties = sap.id
    WHERE sa.id = ?`)
  
  return stmt.get(stringId)
}

const insertString = (stringObj) => {
  const insert = db
    .prepare(
      `
      INSERT INTO string_analyzer (id, value, properties, created_at)
      VALUES (?, ?, ?, ?)
      `
    )

  const result = insert
    .run(
      stringObj.id, stringObj.value, stringObj.properties,
      stringObj.created_at
    )
  return result.lastInsertRowid
}

const insertStringProperties = (propertyObj) => {
  const insert = db
    .prepare(
      `
      INSERT INTO string_analyzer_property (
        length, is_palindrome, unique_characters, word_count,
        sha256_hash, character_frequency_map
      ) VALLUES (?, ?, ?, ?, ?, ?)
      `
    )

  const result = insert
    .run(
      propertyObj.length, propertyObj.is_palindrome,
      propertyObj.unique_characters, propertyObj.word_count,
      propertyObj.sha256_hash, propertyObj.character_frequency_map
    )

  return result.lastInsertRowid
}

const createTables = () => {
  db.exec(createStringAnalyzer)
  db.exec(createStringAnalyzerProperty)
  db.close()
}

module.exports = {
  findString,
  createTables,
  insertString,
  insertStringProperties
}
