/*
 * CLI Tester
 */

// Dependencies
const expect = require('expect');
const cli = require('./../lib/cli');

describe('cli', () => {
  
  it('validates that commands load correctly', () => {
    expect(cli.loadCommands('commands')).not.toBe('null');
  });

  it('validates that commands are validated correctly', () => {
    expect(cli.validateCommand('')).toBeFalsy();
  });
});
