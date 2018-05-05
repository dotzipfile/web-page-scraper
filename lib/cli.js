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
  let buffer = fs.readFileSync(resourceDir + 'testCommands.json');
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
    cli.processInput(str.trim());

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
  const command = cli.validateCommand(str);

  if(command) {
    if(commands[command].parameters) {

      // Split up command keyword and parameters
      let arr = [];
      if(str.indexOf('--') > -1) {
        arr = str.split('--');
      } else {
        console.log('Invalid parameters for:', command);
        return;
      }

      // Make sure parameter is a string
      let parameter = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
      
      if(parameter) {
        parameter = parameter.split(' ')[0];
        e.emit(command, parameter);
      } else {
        console.log('Invalid parameters for:', command);
        return;
      }
    } else {
      e.emit(command);
    }
  }
};

// Validate the command
cli.validateCommand = str => {

  // Make sure we got something as an input
  if(str.length < 1) {
    return false;
  } else {

    // Break input into separate "command parts"
    let commandParts = str.split(' ');

    // Get command keyword
    let command = commandParts.shift();
    command = command.toLowerCase();

    if(commands[command]) {

      // Return command keyword
      return command;
    } else {
      console.log('Unrecognised command: ' + command + '. Try again.');
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
