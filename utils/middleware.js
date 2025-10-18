const logging = require('./logging')

const errorLogger = (error, request, response, next) => {
  console.log('Error Name');
  
  if (error.message.includes('getaddrinfo')) {
    logging.errorLogger(error, request)
    return response
      .status(500)
      .send({ error: 'network error' })
  } else if (error.message.includes('too many request')) {
    logging.errorLogger(error, request)
    return response
      .status(429)
      .send({ error: 'too many requests are received' })
  } else if (error.message.includes('404')) {
    logging.errorLogger(error, request)
    return response
      .status(404)
      .send({ error: 'resources not found on cat API' })
  } else if (error.message.includes('timeout')) {
    logging.errorLogger(error, request)
    return response
      .status(408)
      .send({ error: 'request connection timed out' })
  } else if (error.name.includes('Aggregate')) {
    logging.errorLogger({message: 'network connection error'}, request)
    return response
      .status(503)
      .send({ error: 'network connection error' })
  } else {
    console.log('Error Name :', error.name);
    console.log('Error Message :', error.message);
    return
  }

  next(error)
}

const unknownEndpointLogger = (request, response) => {
  logging.errorLogger({ message: 'unknown endpoint' }, request)
  response
    .status(404)
    .send({ error: 'unknown endpoint' })
}

const requestLogger = (request, response, next) => {
  logging.requestLogger(request)
  next()
}

module.exports = {
  errorLogger,
  unknownEndpointLogger,
  requestLogger,
}
