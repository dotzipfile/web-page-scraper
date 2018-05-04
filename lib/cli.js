/*
 * CLI logic
 */

// Dependencies
const events = require('events');
const readline = require('readline');
class _events extends events{};
const e = new _events();

// Declare CLI module
const cli = {};

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

    // Array of possible commands
    const possibleInput = [
      'exit',
      'scrape'
    ];

    let matchFound = false;

    console.log(cmdParts);

    // // Check if input matches a possible command
    // possibleInput.some(input => {
    //   if(trimmedInput.toLowerCase().indexOf(input) > -1) {
    //     matchFound = true;

    //     // Fire off event based off input
    //     console.log('valid input');
    //     //e.emit(input);
    //     return true;
    //   }
    // });

    // // Re prompt user for input if input was not a match
    // if(!matchFound) {
    //   console.log('Unrecognised command: ' + trimmedInput + '. Try again.');
    // }
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

module.exports = cli;
