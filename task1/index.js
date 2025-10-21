const app = require('./app')
const config = require('./utils/config')

const PORT = config.port

app.listen((PORT) => {
    console.log('server running at', PORT);
})
