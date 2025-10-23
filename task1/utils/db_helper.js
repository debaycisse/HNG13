const { db } = require('./config')

const findString = (stringHash) => {
  const stmt = db.prepare(
    `
    SELECT sa.id, sa.value, sa.created_at, sa.properties, sap.length,
    sap.is_palindrome, sap.unique_characters, sap.word_count,
    sap.sha256_hash, sap.character_frequency_map
    FROM string_analyzer sa
    JOIN string_analyzer_property sap ON sa.properties = sap.id
    WHERE sa.id = ?
    `
  )

  return stmt.get(stringHash)
}

const deleteString = (stringHash, propertiesId) => {
  try {    
    const deleteSaRec = db.prepare(
      `
      DELETE FROM string_analyzer
      WHERE id = ?
      `
    )
    deleteSaRec.run(stringHash)

    const deleteSapRec = db.prepare(
      `
      DELETE FROM string_analyzer_property
      WHERE id = ?
      `
    )
    deleteSapRec.run(propertiesId)

    return 1
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
    let dbQuery = `
      SELECT sa.id, sa.value, sa.created_at, sap.length,
      sap.is_palindrome, sap.unique_characters, sap.word_count,
      sap.sha256_hash, sap.character_frequency_map
      FROM string_analyzer sa
      JOIN string_analyzer_property sap ON sa.properties = sap.id
      `
    const availableColumns = {}
    const filterings = []

    if (queryObj.is_palindrome) {
      filterings.push('sap.is_palindrome = @is_palindrome')
      availableColumns['is_palindrome'] = queryObj.is_palindrome ? 1 : 0
    }

    if (queryObj.min_length) {
      filterings.push('sap.length >= @min_length')
      availableColumns['min_length'] = queryObj.min_length
    }

    if (queryObj.max_length) {
      filterings.push('sap.length <= @max_length')
      availableColumns['max_length'] = queryObj.max_length
    }

    if (queryObj.word_count) {
      filterings.push('sap.word_count = @word_count')
      availableColumns['word_count'] = queryObj.word_count
    }

    if (queryObj.contains_character) {
      filterings.push('sap.character_frequency_map LIKE @contains_character')
      availableColumns['contains_character'] = queryObj.contains_character
    }

    if (filterings.length >= 1) {
      dbQuery += 'WHERE ' + filterings.join(' AND ')
    }

    const stmt = db.prepare(dbQuery)

    return stmt.all(availableColumns)
  } catch (error) {
    return -1
  }
}

const findNaturalLangQueryBasedStrings = (queryObj) => {
  try {
    let dbQuery = `
        SELECT sa.id, sa.value, sa.created_at, sap.length,
        sap.is_palindrome, sap.unique_characters, sap.word_count,
        sap.sha256_hash, sap.character_frequency_map
        FROM string_analyzer sa
        JOIN string_analyzer_property sap ON sa.properties = sap.id
        `
    const availableColumns = {}
    const filterings = []

    if (queryObj.is_palindrome) {
      filterings.push('sap.is_palindrome = @is_palindrome')
      availableColumns['is_palindrome'] = queryObj.is_palindrome? 1 : 0
    }

    if (queryObj.word_count) {
      filterings.push('sap.word_count = @word_count')
      availableColumns['word_count'] = queryObj.word_count
    }

    if (queryObj.min_length) {
      filterings.push('sap.length >= @min_length')
      availableColumns['min_length'] = queryObj.min_length
    }

    if (queryObj.contains_character) {
      filterings
        .push(
          'sap.character_frequency_map LIKE @contains_character'
        )
      availableColumns['contains_character'] =
        `%"${queryObj.contains_character}":%`
    }

    if (filterings.length >= 1)
      dbQuery += 'WHERE ' + filterings.join(' AND ') + ';'

    const stmt = db.prepare(dbQuery)

    return stmt.all(availableColumns)

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
