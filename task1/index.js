const { app } = require('./app')
const { port } = require('./utils/config')

app.listen(port, () => {
    console.log('server running at', port);
})
