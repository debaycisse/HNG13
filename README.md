# HNG13 Task 0

The requirement of this task is to have:

* A working GET /me endpoint is accessible and returns a 200 OK status
* Response structure strictly follows the defined JSON schema
* All required fields (status, user, timestamp, fact) are present
* user object contains email, name, and stack fields with valid string values
* timestamp field returns the current UTC time in ISO 8601 format
* timestamp updates dynamically with every new request
* fact field contains a cat fact fetched from the Cat Facts API
* A new cat fact is fetched on every request (not cached)
* Response Content-Type header is application/json
* Code is well-structured and follows best practices for your chosen stack

### Set up instructions

To setup an environment in which one can use this application, one needs to:

* A `.env` file and provide values for:
  * FACT_URL -- the url of the cat fact's API
  * EMAIL -- your email address
  * NAME -- your full name
  * STACK -- your development stack, such as Python/Django, Node.js/Express, and others
  * RATE_LIMIT_MS -- your rate limit milliseconds
  * RATE_LIMIT_MAX_REQUEST -- your rate limit maximum acceptable number of requests
    
### List of dependencies and how to install them

This is a Node.js application and below are the dependencies, used in this application:
* Axios -- for calling the cat fact api
* Express.js -- the main module that implemented the `/me` endpoint
* Express rate limit -- for rate-limiting purposes
* Supertest -- for testing purposes
* Dotenv -- for accessing environment variables, stored in `.env` file
* Cross-env -- for ensuring multiple platforms compatibility with a given `NODE_ENV` environment variable

#### To install theses dependencies:

`npm install axios express express-rate-limit suppertest dotenv`

`npm install cross-env --save-dev`

### Environment variables, needed:

These needed environment variables are already given above, under Set up instructions.

### Tests

A list of tests have been used for testing the endpoint. These test cases are stored in `/tests/profile_route.test.js` file

### To use the hosted versions of this application

Place GET request to the below url
