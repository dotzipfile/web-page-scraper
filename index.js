// Node Dependencies
const fs = require('fs');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;

// External dependencies
const cheerio = require('cheerio');

// URL to scrape
let scrapeUrl = 'https://www.imdb.com/';
let parsedUrl = url.parse(scrapeUrl, true);

const requestOptions = {
  hostname: parsedUrl.hostname,
  port: 443,
  path: parsedUrl.pathname,
  method: 'GET'
};

const decoder = new stringDecoder('utf-8');
let buffer = '';

const request = https.request(requestOptions, (response) => {
  console.log('statuscode: ', response.statusCode);

  response.on('data', (d) => {
    buffer += decoder.write(d);
  });

  response.on('end', () => {
    buffer += decoder.end();
    buffer = buffer.trim();

    let body = buffer.substring(buffer.indexOf('<body'), buffer.indexOf('</body>') + '</body>'.length);

    const $ = cheerio.load(body);
    let imgArray = $('img');

    for(let i = 0; i < imgArray.length; i ++) {
      console.log(imgArray[i].attribs.src);
    }
  });
});

request.on('error', (e) => {
  console.error(e);
});

request.end();
