# HNG13 Task 1

The requirement of this task is to have:

* A working GET /strings endpoint is accessible and returns a 200 OK status
* A working GET /strings/id endpoint is accessible and returns a 200 OK status
* A working POST /strings endpoint is accessible and returns a 201 OK status
* Response structure strictly follows the defined JSON schema

### Set up instructions

To setup an environment in which one can use this application, one needs to:

* A `.env` file and provide values for:
  * DB -- the file path of the database name
  * TEST_DB -- the file path of the tests database name
  * PORT -- the port number where the server runs
    
### List of dependencies and how to install them

This is a Node.js application and below are the dependencies, used in this application:
* better-sqlite3 -- a fle based SQL or relational database
* Express.js -- the main module that implemented the `/me` endpoin
* Supertest -- for testing purposes
* Dotenv -- for accessing environment variables, stored in `.env` file
* Cross-env -- for ensuring multiple platforms compatibility with a given `NODE_ENV` environment variable

#### To install theses dependencies:

`npm install better-sqlite3 express suppertest dotenv cross-env`

`npm install supertest --save-dev`

### Environment variables, needed:

These needed environment variables are already given above, under Set up instructions.

### Tests

A list of tests have been used for testing the endpoint. These test cases are stored in `/tests/string_analyzer.test.js` file

### To use the hosted versions of this application

Place GET and POST request to the below url

