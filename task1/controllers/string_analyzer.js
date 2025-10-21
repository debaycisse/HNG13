const stringAnalyzerRoutes = require('express').Router()

const {
  createHash, stringExist, is_palindrome, wordCount,
  countUniqueCharacter, createCharFreqMap, formatString
} = require('../utils/util_helper')
// console.log('router module loading after util helper...');

const {
  insertString,
  insertStringProperties,
  findString
} = require('../utils/db_helper')
// console.log('loading stringAnalyzerRoutes module');

stringAnalyzerRoutes
  .post('', async (req, res) => {
    const body = req.body
    
    if (!body.value) {
      return res
      .status(400)
      .send({
        error: 'Invalid request body or missing "value" field'
      })
    }

    if (typeof body.value !== 'string') {
      return res
        .status(422)
        .send({
          error: 'Invalid data type for "value" (must be string)'
        })
    }

    const stringHash = createHash(body.value)

    if (stringExist(stringHash)) {
      return res
        .status(409)
        .send({
          error: 'String already exists in the system'
        })
    }

    const stringValue = body.value

    const sapObj = {
      length: stringValue.length,
      is_palindrome: is_palindrome(stringValue) === true ? 1 : 0,
      unique_characters: countUniqueCharacter(stringValue),
      word_count: wordCount(stringValue),
      sha256_hash: createHash(stringValue),
      character_frequency_map: JSON
        .stringify(createCharFreqMap(stringValue))
    }
    const newSapObj = insertStringProperties(sapObj)

    const saObj = {
      id: createHash(stringValue),
      value: stringValue,
      properties: newSapObj,
      created_at: (new Date()).toISOString()
    }
    insertString(saObj)

    const createdSaObj = findString(saObj.id)
    res
      .status(201)
      .json(formatString(createdSaObj))
  })

module.exports = {
  stringAnalyzerRoutes
}
