require('dotenv').config()
const express = require('express')

const { stringAnalyzerRoutes } = require('./controllers/string_analyzer')
// console.log('app module loading after stringAnalyzerRoute...');

const app = express()

app.use(express.json())
// app.use(requestLogger)  // TODO: requestLogger
app.use('/strings', stringAnalyzerRoutes)
// app.use(unknownEndpoint)  // TODO: unknownEndpoint
// app.use(errorLogger)  // TODO: errorLogger

module.exports = {
    app
}
