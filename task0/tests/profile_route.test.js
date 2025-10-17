const assert = require('node:assert')
const { test, describe, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require('../app')


const api = supertest(app)

// Required endpoint
describe('/me', () => {
  let response = null

  beforeEach(async () => {
    response = await api.get('/me')
    response = response.body
  })

  describe('endpoint is required', () => {
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
      // const response = await api
      //   .get('/me')

      assert(Object.keys(response).includes('fact'))

      const catFact = response.fact
      assert(catFact !== undefined)

      assert(catFact.length > 3)
    })
  })

  describe('field specification', () => {
    // status — Must always be the string "success"
    test(
      'status field must always have the string "success" value',
      async () => {
        // const response = await api.get('/me')
        assert.strictEqual(response.status, "success")
      }
    )

    // user.email — Your personal email address
    test('user.email field must have an email as value',
      async () => {
        const emailRegex =/(((\w+@)|((\w+-)*(\w+)@)|((\w+\.)*(\w+)@))(\w+|((\w+)-)*)\.[a-zA-Z]+)/
        assert(emailRegex.test(response.user.email))
        assert(response.user.email.length >= 5)
    })

    // user.name — Your full name
    test('user.name contains a valid full name', async () => {
      const nameRegex = /(\w+)|((\w+)\s(\w+))/gi
      assert(nameRegex.test(response.user.name))
      assert(response.user.name.length >= 2)
    })
    
    // user.stack — Your backend technology stack (e.g., "Node.js/Express", "Python/Django", "Go/Gin")
    test('user.stack contains a backend stack', async () => {
      const stackRegex = /(\w+|\w+\.\w+)\/\w+/
      assert(stackRegex.test(response.user.stack))
      assert(response.user.stack.length > 4)
    })
    
    // timestamp — Current UTC time in ISO 8601 format (e.g., "2025-10-15T12:34:56.789Z")
    test('timestamp is dynamic', async () => {
      const firstTimestamp = response.timestamp
      const secondResponse = await api.get('/me')
      const secondTimestamp = secondResponse.body.timestamp
      assert(firstTimestamp < secondTimestamp)
    })

    // fact — A random cat fact fetched from the Cat Facts API
    test(
      'cat\'s fact, fetched from the Cat Facts API is random',
      async () => {
        const firstFact = response.fact
        const secondResponse = await api.get('/me')
        const secondFact = secondResponse.body.fact
        assert(firstFact !== secondFact)
      }
    )
  })

  // describe('timestamp field or property', async () => {
  //   // must reflect the current UTC time at the moment of the request

  //   // use ISO 8601 format for consistency

  //   // should update with every new request
  // })

  // describe('cat facts api integration ensures', async () => {
  //   // to use https://catfact.ninja/fact

  //   // to fetch a new cat fact on every request to /me

  //   // handle potential API failures gracefully 

  //   // set appropriate timeout values for the external API call
  // })

  // describe('error handling', async () => {
  //   // handles API failure

  //   // handles network error and timeout

  //   // returns appriopriate HTTP status code
  // })

})

// Field specifications


// Dynamic timestamp


// Cat Facts API integration


// Error handling


// Best practices


