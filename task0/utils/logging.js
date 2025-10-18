const fs = require('fs');

const errorFileName = 'errors.log';
const warningFileName = 'warning.log';
const infoFileName = 'requests.log';
// const contentToWrite = 'Hello, this is some text to write to the file.';

// // Asynchronously write to a file (overwrites if file exists, creates if not)
// fs.writeFile(fileName, contentToWrite, (err) => {
//   if (err) {
//     console.error('Error writing to file:', err);
//     return;
//   }
//   console.log('Content written successfully!');

//   // Optional: Read the file after writing to verify
//   fs.readFile(fileName, 'utf8', (readErr, data) => {
//     if (readErr) {
//       console.error('Error reading file:', readErr);
//       return;
//     }
//     console.log('File content:', data);
//   });
// });

// // To append to an existing file:
// const contentToAppend = '\nThis text is appended.';
// fs.appendFile(fileName, contentToAppend, (err) => {
//   if (err) {
//     console.error('Error appending to file:', err);
//     return;
//   }
//   console.log('Content appended successfully!');
// });

const errorLogger = (error, req) => {
  const content = `
date: ${(new Date()).toISOString()}
error: ${error.message}
request_headers: ${JSON.stringify(req.headers)}
request_method: ${req.method}
------------------
  `
  
  fs.appendFile(
    errorFileName,
    content,
    (err) => {
      if (err) {
        console.error(`Error logging an error content`)
        return
      }
    }
  )
}

const requestLogger = (request) => {
  const requestContent = `
'Date': ${(new Date()).toISOString()}
'Request Header': ${JSON.stringify(request.headers)}
'Method': ${request.method}
'Path': ${request.path}
---------------`

  fs.appendFile(
    infoFileName,
    requestContent,
    (err) => {
      if (err) {
        console.error(`Error logging a request content`)
        return
      }
    }
  )
}

module.exports = {
  errorLogger,
  requestLogger
}
