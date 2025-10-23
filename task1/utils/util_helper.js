const crypto = require('crypto')

const { findString } = require('./db_helper')

const reverse = (string) => {
  let reversedString = ''
  for (let i = string.length - 1; i >= 0; i--) {
    reversedString = reversedString.concat(string[i])
  }
  return reversedString
}

const is_palindrome = (stringValue) => {
  let formattedString = stringValue.toLowerCase()
  formattedString = formattedString.replace(/[\W]/g, '')
  const reversedString = reverse(formattedString)

  for (let i = 0; i <= reversedString.length - 1; i++) {
    if (reversedString[i] !== formattedString[i]) {
      return false
    }
  }

  return true
}

const countUniqueCharacter = (stringValue) => {
  let count = 0
  const character_store = []
  for (let i = 0; i < stringValue.length; i++) {
    if (!character_store.includes(stringValue[i])) {
      character_store.push(stringValue[i])
      count++
    }
  }
  return count
}

const createHash = (stringValue) => {
  return crypto
    .createHash('sha256')
    .update(stringValue)
    .digest('hex')
}

const createCharFreqMap = (stringValue) => {
  const character_store = {}
  for (let i = 0; i < stringValue.length; i++) {
    if (!Object.keys(character_store).includes(stringValue[i])) {
      character_store[stringValue[i]] = 1
    } else {
      character_store[stringValue[i]] = 
        character_store[stringValue[i]] + 1
    }
  }
  return character_store
}

const stringExist = (hashValue) => {
  const stringRecord = findString(hashValue)
  return stringRecord !== undefined
}

const wordCount = (stringValue) => {
  const wordRegex = /((\w+\s)|(\w+))/g
  const stringArray = stringValue.match(wordRegex)
  return stringArray.length
}

const formatString = (stringDataObj) => {
  return {
    id: stringDataObj.id,
    value: stringDataObj.value,
    properties: {
      length: stringDataObj.length,
      is_palindrome: stringDataObj.is_palindrome === 1 ? true : false,
      unique_characters: stringDataObj.unique_characters,
      word_count: stringDataObj.word_count,
      sha256_hash: stringDataObj.sha256_hash,
      character_frequency_map: JSON
        .parse(stringDataObj.character_frequency_map)
    },
    created_at: stringDataObj.created_at
  }
}

const obtainFilter = (queryString) => {
  const supportedQueries = [
    "palindromic", "word", "words", "longer than",
    "first vowel", "second vowel", "third vowel",
    "fourth vowel", "fifth vowel", "last vowel",
    "letter"
  ]

  let notFoundCount = 0
  for (const sq of supportedQueries) {
    if (!queryString.includes(sq)) {
      notFoundCount += 1
    }
  }
  if (notFoundCount === supportedQueries.length)
    return -1

  const filteringObj = {}

  if (queryString.includes(supportedQueries[0]))
    filteringObj['is_palindrome'] = true

  if (queryString.includes(supportedQueries[1]))
    filteringObj['word_count'] = 1

  if (queryString.includes(supportedQueries[2]))
    filteringObj['word_count'] = queryString.match(/\d+/)[0]

  if (queryString.includes(supportedQueries[3]))
    filteringObj['min_length'] = queryString.match(/\d+/)[0]

  if (queryString.includes(supportedQueries[4]))
    filteringObj['contains_character'] = 'a'

  if (queryString.includes(supportedQueries[5]))
    filteringObj['contains_character'] = 'e'

  if (queryString.includes(supportedQueries[6]))
    filteringObj['contains_character'] = 'i'

  if (queryString.includes(supportedQueries[7]))
    filteringObj['contains_character'] = 'o'

  if (
      queryString.includes(supportedQueries[8]) || 
      queryString.includes(supportedQueries[9])
    ) {
      filteringObj['contains_character'] = 'u'
    }

  if (queryString.includes(supportedQueries[10]))
    filteringObj['contains_character'] = queryString.match(/\b[a-zA-Z]\b/)

  return filteringObj
}

module.exports = {
  is_palindrome,
  countUniqueCharacter,
  createHash,
  createCharFreqMap,
  stringExist,
  wordCount,
  formatString,
  obtainFilter
}