const { describe, beforeEach, after, test } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')  // TODO: install
const { app } = require('../app') // TODO: create the app.js file as the root
const { db } = require('../utils/config')
const api = supertest(app)

describe('string analyzer', () => {
  describe('POST request', () => {
    beforeEach(() => {
      const stmts = [
        `DELETE FROM string_analyzer`,
        `DELETE FROM string_analyzer_property`
      ]

      for (const stmt of stmts) {
        db.exec(stmt)
      }
    })

    test(
      'with valid data should create a new instance of string analyzer'
      , 
      async () => {
        const response = await api
          .post('/strings')
          .send({
            "value": "The brown fox jumps over the lazy dog"
          })
          .expect(201)
        assert(
          response.body !== null
        )        
        assert(
          Object.keys(response.body).includes('id')
        )
        assert(
          Object.keys(response.body).includes('value')
        )
        assert(
          Object.keys(response.body).includes('properties')
        )
        assert(
          Object.keys(response.body.properties)
            .includes('is_palindrome')
        )
        assert(
          Object.keys(response.body.properties)
            .includes('unique_characters')
        )
        assert(
          Object.keys(response.body.properties)
            .includes('word_count')
        )
        assert(
          Object.keys(response.body.properties)
            .includes('sha256_hash')
        )
        assert(
          Object.keys(response.body.properties)
            .includes('character_frequency_map')
        )
        assert(Object.keys(response.body).includes('created_at'))
      }
    )

    test(
      'with a valid data returns data in json format',
      async () => {
        await api
          .post('/strings')
          .send({
            value: "string to analyze"
          })
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }
    )

    test(
      'with the same string returns 409 status code',
      async () => {
        await api
          .post('/strings')
          .send({ value: 'The same string' })

        await api
          .post('/strings')
          .send({ value: 'The same string' })
          .expect(409)
      }
    )

    test(
      'without any string data returns 400 status code',
      async () => {
        await api
          .post('/strings')
          .send({})
          .expect(400)
      }
    )

    test(
      'with an invalid non-string data returns 422 status code',
      async () => {
        await api
          .post('/strings')
          .send({"value": ["string 1", "string 1"]})
          .expect(422)
      }
    )
  })

  describe('GET a string request', () => {
    test(
      'of an existing string should be successful',
      async () => {
        const string_value = await api
          .post('/strings')
          .send({
            value: "string to get"
          })
          .expect(201)
          .expect('Content-Type', /application\/json/)

        await api
          .get(`/strings/${string_value.body.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }
    )

    test(
      'of a non-exisitng string returns 404 status code',
      async () => {
        const non_existing_string = 'non-existing'

        await api
          .get(`/strings/${non_existing_string}`)
          .expect(404)
      }
    )
  })

  describe('GET all Strings with Filtering', () => {
    beforeEach(() => {
      const deleteStmts = [
        `DELETE FROM string_analyzer`,
        `DELETE FROM string_analyzer_property`
      ]

      for (const stmt of deleteStmts) {
        db.exec(stmt)
      }
    })

    test(
      'returns 200 status for valid query parameters',
      async () => {
        await api
          .get(`/strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a`
          )
          .expect(200)
      }
    )

    test(
      'returns 400 status for invalid query parameters values or types',
      async () => {
        await api
          .get('/strings?is_palindromest=true'
          )
          .expect(400)
      }
    )
  })

  describe('Natural Language Filtering, such as', () => {
    beforeEach(() => {
      const deleteStmts = [
        `DELETE FROM string_analyzer`,
        `DELETE FROM string_analyzer_property`
      ]

      for (const stmt of deleteStmts) {
        db.exec(stmt)
      }
    })

    test(
      '"all single word palindromic strings" returns 200 status',
      async () => {
        await api.post('/strings').send({"value": "Level"}).expect(201)

        const response = await api
          .get('/strings/filter-by-natural-language?query%20all%20single%20word%20palindromic%20strings')
          .expect(200)

        assert.strictEqual(response.body.length, 1)
      }
    )

    test(
      '"strings longer than 10 characters" return 200 status',
      async () => {
        await api.post('/strings').send({
          "value": "The characters here are longer than ten"
        }).expect(201)

        const response = await api
          .get('/strings/filter-by-natural-language?strings%20longer%20than%2010%20characters')
          .expect(200)

        assert.strictEqual(response.body.length, 1)
      }
    )

    test(
      '"palindromic strings that contain the first vowel" returns 200 status',
      async () => {
        await api.post('/strings').send({
          "value": "A man, a plan, a canal, Panama!"
        }).expect(201)

        const response = await api
          .get('/strings/filter-by-natural-language?palindromic%20strings%20that%20contain%20the%20first%20vowel')
          .expect(200)

        assert.strictEqual(response.body.length, 1)
      }
    )

    test(
      '"strings containing the letter z" returns 200 status',
      async () => {
        await api.post('/strings').send({
          "value": "Azeeza"
        })
        const response = await api
          .get('/strings/filter-by-natural-language?strings%20containing%20the%20letter%20z')
          .expect(200)
  
        assert.strictEqual(response.body.length, 1)
      }
    )

    test(
      'Invalid natural language query returns 400 status',
      async () => {
        await api
          .get('/strings/filter-by-natural-language?this query is invalid')
          .expect(400)
      }
    )

    test(
      'Conflicting query should return 422 status',
      async () => {
        await api
          .get('/strings/filter-by-natural-language?strings%20longer%20than%2010%20and%20lesser%20than%205')
          .expect(422)
      }
    )
  })

  describe('DELETE String', () => {
    beforeEach(() => {
      const deleteStmts = [
        `DELETE FROM string_analyzer`,
        `DELETE FROM string_analyzer_property`
      ]

      for (const stmt of deleteStmts) {
        db.exec(stmt)
      }
    })

    test(
      'for existing, valid String should return 204 status',
      async () => {
        const stringToDelete = await api
          .post('/strings')
          .send({
            value: 'the string to be deleted'
          })
          .expect(201)
        
        await api
          .delete(`/strings/${stringToDelete.body.id}`)
          .expect(204)
      }
    )
  })

  after(async () => {
    db.close()
  })
})
