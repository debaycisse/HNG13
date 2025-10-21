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
  const reversedString = reverse(stringValue)

  for (let i = 0; i <= stringValue.length - 1; i++) {
    if (reversedString[i] !== stringValue[i]) {
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

module.exports = {
  is_palindrome,
  countUniqueCharacter,
  createHash,
  createCharFreqMap,
  stringExist
}