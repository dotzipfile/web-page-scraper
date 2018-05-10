# web-page-scraper
NodeJS CLI tool for scraping web pages

#h3 To run:

npm install

node index.js

#h3 To use:

**exit** to exit the application

**scrape --{URL}** to scrape the specified url

eg. **scrape --https://www.imdb.com**

Scraped urls will be saved to a file in the res directory called: **scrapedUrls.txt**

If there are already urls in the file, they will be overwritted when the scrape command is run.
