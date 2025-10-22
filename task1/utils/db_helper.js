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

const deleteString = (stringHash, properties) => {
  try {
    const deleteSaRec = db.prepare(
      `
      DELETE FROM string_analyzer
      WHERE id = ?
      `
    )
    stmt.get(stringHash)

    const deleteSapRec = db.prepare(
      `
      DELETE FROM string_analyzer_property
      WHERE id = ?
      `
    )
    stmt.get(properties)
  } catch (error) {
    return -1
  }
  
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

const findQueryBasedStrings = (queryObj) => {
  try {
    const stmt = db.prepare(
      `
      SELECT sa.id, sa.value, sa.created_at, sap.length,
      sap.is_palindrome, sap.unique_characters, sap.word_count,
      sap.sha256_hash, sap.character_frequency_map
      FROM string_analyzer sa
      JOIN string_analyzer_property sap ON sa.properties = sap.id
      WHERE sap.is_palindrome = ? AND sap.length >= ?
        AND sap.length <= ? AND sap.word_count = ?
        AND sap.character_frequency_map LIKE ?
      `
    )

    return stmt.all(
      queryObj.is_palindrome === true ? 1 : 0,
      queryObj.min_length,
      queryObj.max_length,
      queryObj.word_count,
      `%"${queryObj.contains_character}":%`
    )
  } catch (error) {
    return -1
  }
}

const findNaturalLangQueryBasedStrings = (queryObj) => {
  try {
    let stmt = null
    
    if (
      queryObj.word_count && queryObj.is_palindrome &&
      !queryObj.min_length && !queryObj.contains_character
    ) {
      stmt = db.prepare(
        `
        SELECT sa.id, sa.value, sa.created_at, sap.length,
        sap.is_palindrome, sap.unique_characters, sap.word_count,
        sap.sha256_hash, sap.character_frequency_map
        FROM string_analyzer sa
        JOIN string_analyzer_property sap ON sa.properties = sap.id
        WHERE sap.is_palindrome = ? AND sap.word_count = ?
        `
      )
      return stmt.all(
        queryObj.is_palindrome,
        queryObj.word_count,
      )
    } else if (
      !queryObj.word_count && !queryObj.is_palindrome &&
      queryObj.min_length && !queryObj.contains_character
    ) {
      stmt = db.prepare(
        `
        SELECT sa.id, sa.value, sa.created_at, sap.length,
        sap.is_palindrome, sap.unique_characters, sap.word_count,
        sap.sha256_hash, sap.character_frequency_map
        FROM string_analyzer sa
        JOIN string_analyzer_property sap ON sa.properties = sap.id
        WHERE sap.length >= ?
        `
      )
      return stmt.all(
        queryObj.min_length,
      )
    } else if (
      !queryObj.word_count && queryObj.is_palindrome &&
      !queryObj.min_length && queryObj.contains_character
    ) {
      stmt = db.prepare(
        `
        SELECT sa.id, sa.value, sa.created_at, sap.length,
        sap.is_palindrome, sap.unique_characters, sap.word_count,
        sap.sha256_hash, sap.character_frequency_map
        FROM string_analyzer sa
        JOIN string_analyzer_property sap ON sa.properties = sap.id
        WHERE sap.is_palindrome = ?
          AND sap.character_frequency_map LIKE ?
        `
      )
      return stmt.all(
        queryObj.is_palindrome,
        `%"${queryObj.contains_character}":%`
      )
    }  else if (
      !queryObj.word_count && !queryObj.is_palindrome &&
      !queryObj.min_length && queryObj.contains_character
    ) {
      stmt = db.prepare(
        `
        SELECT sa.id, sa.value, sa.created_at, sap.length,
        sap.is_palindrome, sap.unique_characters, sap.word_count,
        sap.sha256_hash, sap.character_frequency_map
        FROM string_analyzer sa
        JOIN string_analyzer_property sap ON sa.properties = sap.id
        WHERE sap.character_frequency_map LIKE ?
        `
      )
      return stmt.all(
        `%"${queryObj.contains_character}":%`
      )
    }

  } catch (error) {
    return -1
  }
}

module.exports = {
  findString,
  deleteString,
  insertString,
  insertStringProperties,
  findQueryBasedStrings,
  findNaturalLangQueryBasedStrings
}
