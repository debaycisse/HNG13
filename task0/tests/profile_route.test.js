const assert = require('node:assert')
const { test, describe, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require('../app')


const api = supertest(app)

// Required endpoint
describe('/me', async () => {
  describe('endpoint is required', async () => {
    // to be reachable at /me route
    test('to be reachable at /me', async () => {
      await api
        .get('/me')
        .expect(200)
    })

    // to return JSON data
    test('to return JSON data', async () => {
      await api
        .get('/me')
        .expect('Content-Type', /application\/json/)
    })

    // to integrate with the Cat Facts API to fetch dynamic cat facts
    test('to integrate with the Cat Facts API to fetch dynamic cat facts', async () => {
      const response = await api
        .get('/me')

      const responseData = response.body
      assert(Object.keys(responseData).includes('fact'))

      const catFact = responseData.fact
      assert(catFact !== undefined)
    })
  })

  describe('field specification', async () => {
    // status — Must always be the string "success"

    // user.email — Your personal email address

    // user.name — Your full name
    
    // user.stack — Your backend technology stack (e.g., "Node.js/Express", "Python/Django", "Go/Gin")
    
    // timestamp — Current UTC time in ISO 8601 format (e.g., "2025-10-15T12:34:56.789Z")
    
    // fact — A random cat fact fetched from the Cat Facts API
  })

  describe('timestamp field or property', async () => {
    // must reflect the current UTC time at the moment of the request

    // use ISO 8601 format for consistency

    // should update with every new request
  })

  describe('cat facts api integration ensures', async () => {
    // to use https://catfact.ninja/fact

    // to fetch a new cat fact on every request to /me

    // handle potential API failures gracefully 

    // set appropriate timeout values for the external API call
  })

  describe('error handling', async () => {
    // handles API failure

    // handles network error and timeout

    // returns appriopriate HTTP status code
  })

})

// Field specifications


// Dynamic timestamp


// Cat Facts API integration


// Error handling


// Best practices


