const stringAnalyzerRoutes = require('express').Router()

const {
  createHash, stringExist, is_palindrome, wordCount,
  countUniqueCharacter, createCharFreqMap, formatString
} = require('../utils/util_helper')

const {
  insertString,
  insertStringProperties,
  findString,
  findQueryBasedStrings
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
          error: 'Invalid data type for value (must be string)'
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

stringAnalyzerRoutes
  .get('/:stringId', async (req, res) => {
    const stringId = req.params.stringId

    if (!stringExist(stringId)) {
      return res
        .status(404)
        .send({
          error: 'String does not exist in the system'
        })
    }

    const foundString = findString(stringId)
    res.status(200).json(formatString(foundString))
  })

stringAnalyzerRoutes
  .get('', async (req, res) => {
    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character
    } = req.query

    const is_palindrome_invalid =
      typeof Boolean(is_palindrome) !== 'boolean'
    const min_length_invalid =
      typeof Number(min_length) !== 'number'
    const max_length_invalid =
      typeof Number(max_length) !== 'number'
    const word_count_invalid =
      typeof Number(word_count) !== 'number'
    const contains_character_invalid =
      typeof contains_character !== 'string'
    
    if (
      !is_palindrome || !min_length || !max_length ||
      !word_count || !contains_character || is_palindrome_invalid ||
      min_length_invalid || max_length_invalid ||
      word_count_invalid || contains_character_invalid
    ) {
      return res.status(400).send({
        error: 'Invalid query parameter values or types'
      })
    }

    const queryObj = {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character
    }

    const foundStrings = findQueryBasedStrings(queryObj)

    let formattedFoundStrings = null

    if (foundStrings.length > 0) {
      formattedFoundStrings = foundStrings
        .map(foundString => formatString(foundString))
    }

    res.status(200).json(formattedFoundStrings)

  })

module.exports = {
  stringAnalyzerRoutes
}
