# web-page-scraper
NodeJS CLI tool for scraping web pages

To run:
  npm install
  ndoe index.js

To use:
  Type: exit to exit the application
  Type: scrape --{URL} to scrape the specified url
    eg. scrape --https://www.imdb.com

Scraped urls will be saved to a file in the res directory called: scrapedUrls.txt
  If there are already urls in the file, they will be overwritted when the scrape command is run.
