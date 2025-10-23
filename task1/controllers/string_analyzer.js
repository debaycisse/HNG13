const stringAnalyzerRoutes = require('express').Router()

const {
  createHash, stringExist, is_palindrome, wordCount,
  countUniqueCharacter, createCharFreqMap, formatString,
  obtainFilter
} = require('../utils/util_helper')

const {
  insertString,
  insertStringProperties,
  findString,
  findQueryBasedStrings,
  findNaturalLangQueryBasedStrings,
  deleteString
} = require('../utils/db_helper')

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
  .get('/:stringId', async (req, res, next) => {
    if (req.params.stringId === 'filter-by-natural-language')
      return next()

    const stringId = req.params.stringId

    const foundString = findString(stringId)
    if (!foundString) {      
      return res
        .status(404)
        .send({
          'error': 'String does not exist in the system'
        })
    }
    res.status(200).json(formatString(foundString))
  })

stringAnalyzerRoutes
  .get('', async (req, res) => {
    const queryString = {...req.query}

    const palindromeType =
      typeof Boolean(queryString.is_palindrome) === 'boolean'
    const minLengthType =
      typeof Number(queryString.min_length) === 'number'
    const maxLengthType =
      typeof Number(queryString.max_length) === 'number'
    const wordCountType =
      typeof Number(queryString.word_count) === 'number'
    const containsCountType =
      typeof String(queryString.contains_character) === 'string'
    
    const notSupported = 
      !Object.keys(queryString).includes('is_palindrome') &&
      !Object.keys(queryString).includes('min_length') &&
      !Object.keys(queryString).includes('max_length') &&
      !Object.keys(queryString).includes('word_count') &&
      !Object.keys(queryString).includes('contains_character')

    if (
      (queryString.is_palindrome && !palindromeType) ||
      (queryString.min_length && !minLengthType) ||
      (queryString.max_length && !maxLengthType) ||
      (queryString.word_count && !wordCountType) ||
      (queryString.contains_character && !containsCountType) ||
      notSupported
    ) {
      return res.status(400).send({
        error: 'Invalid query parameter values or types'
      })
    }

    const foundStrings = findQueryBasedStrings(queryString)

    if (foundStrings === -1) {
      return res.status(400).send({
        error: 'Invalid query parameter values or types'
      })
    }

    let formattedFoundStrings = []

    if (foundStrings.length > 0) {
      formattedFoundStrings = foundStrings
        .map(foundString => formatString(foundString))
    }

    res.status(200).json(formattedFoundStrings)

  })

stringAnalyzerRoutes
  .get('/filter-by-natural-language', async (req, res) => {
    const queryStr = (Object.keys(req.query))[0]

    const filteringObj = obtainFilter(queryStr)
    
    if (filteringObj === -1) {
      return res.status(400).send({
        error: 'Unable to parse natural language query'
      })
    }

    const foundStrings =
      findNaturalLangQueryBasedStrings(filteringObj)
    
    if (foundStrings === -1) {
      return res.status(422).send({
        error: 'Query parsed but resulted in conflicting filters'
      })
    }

    let formattedFoundStrings = []

    if (foundStrings.length > 0) {
      formattedFoundStrings = foundStrings
        .map(foundString => formatString(foundString))
    }

    res.status(200).json(formattedFoundStrings)
  })

stringAnalyzerRoutes
  .delete('/:stringId', async (req, res, next) => {
    const stringId = req.params.stringId

    const foundString = findString(stringId)

    if (!foundString) {
      return res
        .status(404)
        .send({
          'error': 'String does not exist in the system'
        })
    }

    
    const result = deleteString(stringId, foundString.properties)
    console.log('result:', result);

    if (result === -1) {
      return res.status(500).send({
        error: "Server error, couldn't delete string"
      })
    }
    res.status(204).end()
  })

module.exports = {
  stringAnalyzerRoutes
}
