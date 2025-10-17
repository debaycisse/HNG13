require('dotenv').config()
const express = require('express')
const profileRouter = require('./controller/profile')

const app = express()

app.use(express.json())
// app.use(middleware.requestLogger)  // middleware request logger
app.use('/me', profileRouter)  // profile router
// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)  // error handler


module.exports = app
