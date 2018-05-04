/*
 * CLI logic
 */

// Dependencies
const events = require('events');
const readline = require('readline');
class _events extends events{};
const e = new _events();
const fs = require('fs');
const path = require('path');
const stringDecoder = require('string_decoder').StringDecoder;
const scraper = require('./scraper');

// Declare CLI module
const cli = {};

// Config for reading in command file
const resourceDir = path.join(__dirname, '/../res/');

// Read commands from file synchronously because the app depends on the file
const decoder = new stringDecoder('utf-8');
let commands = [];
try {
  let buffer = fs.readFileSync(resourceDir + 'commands.json');
  commands = JSON.parse(decoder.write(buffer));
} catch(e) {
  console.log('Error reading commands file:', e.message);
  process.exit(0);
}

// Initialise CLI
cli.init = () => {
  console.log('Page scraper is running...');

  // Start the interface
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
  });

  // Initial prompt
  _interface.prompt();

  // Handle input
  _interface.on('line', str => {

    // Send string to input processor
    cli.processInput(str);

    // Re-initialise the prompt
    setTimeout(() => _interface.prompt(), 50);
  });

  // Kill process when CLI is closed
  _interface.on('close', () => {
    console.log('\nClosing...');
    process.exit(0);
  });
};

// Process users input
cli.processInput = str => {
  
  // Validate input
  const cmdParts = cli.validateInput(str);

  // Process string if valid
  if(cmdParts) {

    // Set to true if valid command has been entered
    let matchFound = false;

    // Check if input matches a possible command
    commands.some(input => {
      if(cmdParts[0].toLowerCase().indexOf(input.command) > -1) {
        matchFound = true;

        // Fire off event based off of the command
        if(input.parameters) {
          e.emit(input.command, cmdParts);
        } else {
          e.emit(input.command);
        }

        return true;
      }
    });

    // Re prompt user for input if input was not a match
    if(!matchFound) {
      console.log('Unrecognised command: ' + cmdParts[0] + '. Try again.');
    }
  }
};

cli.validateInput = str => {

  // Make sure we got something as an input
  if(str.length < 1) {
    return false;
  } else {

    // Prepare input by trimming
    const trimmedInput = str.trim();

    // Break input into separate "command parts"
    let commandParts = trimmedInput.split(' ');

    // Remove empty parts
    commandParts = commandParts.filter(item => item.length > 0);

    if(commandParts.length > 0) {
      // Return new array
      return commandParts;
    } else {
      return false;
    }
  }
};

// When exit command is entered, close CLI
e.on('exit', () => {
  console.log('Closing...');
  process.exit(0);
});

// When scrape command is entered invoke scrape module
e.on('scrape', (params) => {
  scraper.scrape(params);
});

// Export CLI module
module.exports = cli;
