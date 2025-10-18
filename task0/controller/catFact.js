const axios = require('axios')

const fact = async () => {
  const catFactObject = await axios
    .get(
      process.env.FACT_URL,
      { timeout: 5000 }
    )
  
  return {
    fact: catFactObject.data.fact,
    url: catFactObject.config.url
  }
}

module.exports = fact
