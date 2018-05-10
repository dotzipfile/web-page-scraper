/*
 * Scraper logic
 */

// Dependencies
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const path = require('path');

// External dependencies
const cheerio = require('cheerio');

// Resource Dir
const resourceDir = path.join(__dirname, '/../res/');

// Declare Scraper module
const scraper = {};

scraper.scrape = (unParsedUrl) => {

  // Parse url
  let parsedUrl = url.parse(unParsedUrl);
  
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

  const request = https.request(requestOptions, (response) => {
  
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
      let urlString = '';
  
      // Loop through img tabs and print source url for each one
      for(let i = 0; i < imgArray.length; i ++) {
        urlString += imgArray[i].attribs.src + '\n';
      }

      // Write to file
      fs.writeFileSync(resourceDir + 'scrapedUrls.txt', urlString, 'utf-8');
    });
  });

  // Output request error
  request.on('error', (e) => {
    console.error('There was an error with the URL you tried to scrape:', e.code);
  });
  
  // Close request
  request.end();
};

// Export Scraper module
module.exports = scraper;
