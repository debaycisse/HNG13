const stringAnalyzerRoutes = require('express').Router()
const config = require('../utils/config')
const { createHash, stringExist } = require('../utils/util_helper')

stringAnalyzerRoutes
  .post((req, res) => {
    const body = req.body
    
    if (!body.value) {
      return res
      .status(400)
      .send({
        error: 'Invalid request body or missing "value" field'
      })
    }

    if (typeof body.value !== 'string') {
      return res
        .status(422)
        .send({
          error: 'Invalid data type for "value" (must be string)'
        })
    }

    const stringHash = createHash(body.value)

    if (stringExist(stringHash)) {
      return res
        .status(409)
        .send({
          error: 'String already exists in the system'
        })
    }

    // insert into string_analyzer_property firstly
      // create the data for the string_analyzer_property
      // and call insertStringProperties() from db_helper

    // then insert into string_analizer, using the id of the string_analyzer_property
       // create the data for the string_analyzer,
       // don't forget to pick the id from the above string_analyzer_property insert
      // and call insertString() from db_helper
  })

module.exports = {
  stringAnalyzerRoutes
}
