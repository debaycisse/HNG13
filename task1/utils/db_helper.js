const { db } = require('./config')



const findString = (stringHash) => {
  const stmt = db.prepare(
    `
    SELECT sa.id, sa.value, sa.created_at, sap.length,
    sap.is_palindrome, sap.unique_characters, sap.word_count,
    sap.sha256_hash, sap.character_frequency_map
    FROM string_analyzer sa
    JOIN string_analyzer_property sap ON sa.properties = sap.id
    WHERE sa.id = ?
    `
  )
  
  return stmt.get(stringHash)
}

const insertString = (stringObj) => {
  const insert = db.prepare(
    `
    INSERT INTO string_analyzer (id, value, properties, created_at)
    VALUES (?, ?, ?, ?)
    `
  )

  insert
    .run(
      stringObj.id, stringObj.value, stringObj.properties,
      stringObj.created_at
    )
}

const insertStringProperties = (propertyObj) => {
  const insert = db
    .prepare(
      `
      INSERT INTO string_analyzer_property (
        length, is_palindrome, unique_characters, word_count,
        sha256_hash, character_frequency_map
      ) VALUES (?, ?, ?, ?, ?, ?)
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

module.exports = {
  findString,
  insertString,
  insertStringProperties
}
