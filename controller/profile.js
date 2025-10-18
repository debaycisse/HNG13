const profileRouter = require('express').Router()
const catFact = require('./catFact')

profileRouter
  .get('', async (request, response) => {
    const userData = {
      "status": "success",
      "user": {
        "email": process.env.EMAIL,
        "name": process.env.NAME,
        "stack": process.env.STACK,
      },
      "timestamp": (new Date()).toISOString(),
      "fact": ""
    }
    // set timer for this request as required
    const { fact, url } = await catFact()
    userData.fact = fact
    if (process.env.NODE_ENV === 'test') {
      userData.url = url
    }
    
    response.status(200).json(userData)
  })

module.exports = profileRouter
