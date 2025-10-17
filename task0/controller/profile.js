const profileRouter = require('express').Router()
const catFact = require('./catFact')

profileRouter
  .get('', async (request, response) => {
    const userData = {
      "status": "success",
      "user": {
        "email": "debaycisse@gmail.com",  // process.env.email
        "name": "Azeez Adebayo",          // process.env.name
        "stack": "Node.js/Express"       // process.env.stack
      },
      "timestamp": (new Date()).toISOString(),
      "fact": ""
    }

    // set timer for this request as required
    const fact = await catFact()
    userData.fact = fact
    response.status(200).json(userData)
  })

module.exports = profileRouter
