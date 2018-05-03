// Dependencies
const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

// Declare app
const app = express();

// Config variables
const port = 3000;

// Define /scrape route
app.get('/scrape', function(req, res) {
  
});

app.listen(port, () => {
  console.log('App is listening on port: ' + port);
});
