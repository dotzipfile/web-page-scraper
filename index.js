// Node Dependencies
const fs = require('fs');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const repl = require('repl');

// External dependencies
const cheerio = require('cheerio');

const cli = require('./lib/cli.js');

cli.init();

// Scrape a web page
const scrape = (parsedUrl) => {
  
  // Request config
  const requestOptions = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.pathname,
    method: 'GET'
  };
  
  // String decoder for decoding text into buffer
  const decoder = new stringDecoder('utf-8');
  let buffer = '';
  
  // Request to specified url with request config defined above
  const request = https.request(requestOptions, (response) => {
    
    // Log status code
    console.log('statuscode: ', response.statusCode);
  
    // When server receives data back from the request, append it to our buffer
    response.on('data', (d) => {
      buffer += decoder.write(d);
    });
  
    // When all data has been received process it
    response.on('end', () => {

      // Close off buffer and trim
      buffer += decoder.end();
      buffer = buffer.trim();
  
      // Get the html body from buffer
      let body = buffer.substring(buffer.indexOf('<body'), buffer.indexOf('</body>') + '</body>'.length);
  
      // Create DOM from html string
      const $ = cheerio.load(body);

      // Create array of all img tags found in body
      let imgArray = $('img');
  
      // Loop through img tabs and print source url for each one
      for(let i = 0; i < imgArray.length; i ++) {
        console.log(imgArray[i].attribs.src);
      }
    });
  });
  
  // Output request error
  request.on('error', (e) => {
    console.error(e);
  });
  
  // Close request
  request.end();
}
