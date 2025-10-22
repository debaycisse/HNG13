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

module.exports = {
  is_palindrome,
  countUniqueCharacter,
  createHash,
  createCharFreqMap,
  stringExist,
  wordCount,
  formatString
}