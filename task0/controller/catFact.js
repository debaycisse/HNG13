const axios = require('axios')

const fact = async () => {
  const catFactObject = await axios.get(process.env.FACT_URL)
  return catFactObject.data.fact
}

module.exports = fact
