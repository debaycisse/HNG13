const { describe, beforeEach, test } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')  // TODO: install
const app = require('../app') // TODO: create the app.js file as the root
const api = supertest(app)

describe('string analyzer', () => {
  describe('POST request', () => {
    test(
      'with valid data should create a new instance of string analyzer'
      , 
      async () => {
        const response = await api
          .post('/strings')
          .send({
            value: "The brown fox jumps over the lazy dog"
          })
          .expect(201)
        assert(
          response.body !== null
        )
        assert(response.body.includes('id'))
        assert(response.body.includes('value'))
        assert(response.body.includes('properties'))
        assert(response.body.properties.includes('is_palindrome'))
        assert(response.body.properties.includes('unique_characters'))
        assert(response.body.properties.includes('word_count'))
        assert(response.body.properties.includes('sha256_hash'))
        assert(response.body.properties.includes('character_frequency_map'))
        assert(response.body.includes('created_at'))
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
          .send()
          .expect(400)
      }
    )

    test(
      'with an invalid non-string data returns 422 status code',
      async () => {
        await api
          .post('/strings')
          .send()
          .expect(422)
      }
    )

  describe('GET request', () => {
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
          .get(`/strings/${string_value.body.value}`)
          .expect(200)
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

  })
})
