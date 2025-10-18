require('dotenv').config()
const express = require('express')
const rateLimite = require('express-rate-limit')
const profileRouter = require('./controller/profile')
const middleware = require('./utils/middleware')

const app = express()

const limiter = rateLimite({
  windowMs: Number(process.env.RATE_LIMIT_MS),
  max: Number(process.env.RATE_LIMIT_MAX_REQUEST),
  handler: (request, response, next) => {
    middleware.errorLogger(
      {message: 'too many requests are received'},
      request,
      response,
      next
    )
  }
})

app.use(limiter)
app.use(express.json())
app.use(middleware.requestLogger)  // middleware request logger
app.use('/me', profileRouter)  // profile router
app.use(middleware.unknownEndpointLogger)
app.use(middleware.errorLogger)  // error handler


module.exports = app
