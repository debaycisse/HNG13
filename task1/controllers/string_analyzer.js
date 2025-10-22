const stringAnalyzerRoutes = require('express').Router()

const {
  createHash, stringExist, is_palindrome, wordCount,
  countUniqueCharacter, createCharFreqMap, formatString
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

    if (!stringExist(stringId)) {
      return res
        .status(404)
        .send({
          'error': 'String does not exist in the system'
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
    const queryStr = req.query.query
    // console.log('queryStr:', queryStr)  // queryStr: all single word palindromic strings
    

    if (queryStr.length = 0) {
      return res.status(400).send({
        error: 'Unable to parse natural language query'
      })   
    }
    const supportedQueries = [
      "single word palindromic strings",
      "strings longer than",
      "palindromic strings that contain",
      "strings containing the letter"
    ]

    if (
      !queryStr.includes(supportedQueries[0]) &&
      !queryStr.includes(supportedQueries[1]) &&
      !queryStr.includes(supportedQueries[2]) &&
      !queryStr.includes(supportedQueries[3])
    ) {
      return res.status(422).send({
        error: 'Query parsed but resulted in conflicting filters'
      })
    }

    const filteringObject = {}

    const formattedQueryStr = queryStr.replace(/%20/g, ' ')
    
    if (formattedQueryStr.includes(supportedQueries[0])) {
      filteringObject['word_count'] = 1
      filteringObject['is_palindrome'] = 1
    }
    
    if (
      formattedQueryStr.includes(supportedQueries[1]) &&
      formattedQueryStr.includes('character')
    ) {
      const numberValue = formattedQueryStr.match(/\d+/)[0]
      filteringObject['min_length'] = numberValue
    }

    if (
      formattedQueryStr
        .includes(supportedQueries[2])
    ) {
      filteringObject['is_palindrome'] = 1
    }

    if (formattedQueryStr.includes('first vowel')) {
      filteringObject['contains_character'] = 'a'
    } else if (formattedQueryStr.includes('second vowel')) {
      filteringObject['contains_character'] = 'e'
    } else if (formattedQueryStr.includes('third vowel')) {
      filteringObject['contains_character'] = 'i'
    } else if (formattedQueryStr.includes('fourth vowel')) {
      filteringObject['contains_character'] = 'o'
    } else if (
      formattedQueryStr.includes('last vowel') ||
      formattedQueryStr.includes('fifth vowel')
    ) {
      filteringObject['contains_character'] = 'u'
    }

    if (
      formattedQueryStr.includes(supportedQueries[3])
    ) {
      const letterValue = formattedQueryStr.match(/\w$/)[0]
      filteringObject['contains_character'] = letterValue
    }

    // console.log('filteringObject:', filteringObject);
    
    const foundStrings =
      findNaturalLangQueryBasedStrings(filteringObject)
    
    if (foundStrings === -1) {
      return res.status(422).send({
        error: 'Query parsed but resulted in conflicting filters'
      })
    }

    let formattedFoundStrings = []

    // console.log('foundStrings:', foundStrings);
    

    if (foundStrings.length > 0) {
      formattedFoundStrings = foundStrings
        .map(foundString => formatString(foundString))
    }

    res.status(200).json(formattedFoundStrings)
  })

stringAnalyzerRoutes
  .delete('/:stringId', async (req, res, next) => {
    // if (req.params.stringId === 'filter-by-natural-language')
    //   return next()

    const stringId = req.params.stringId

    if (!stringExist(stringId)) {
      return res
        .status(404)
        .send({
          'error': 'String does not exist in the system'
        })
    }

    const foundString = findString(stringId)

    const result = deleteString(stringId, foundString.properties)

    if (result === -1) {
      return res.status(404).send({
        error: "String does not exist in the system"
      })
    }

    res.status(204).end()
  })

module.exports = {
  stringAnalyzerRoutes
}
