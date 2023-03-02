const fs = require('fs');
const Parser = require('./parser');
const Compiler = require('./compiler');
const { argv, exit } = require('process');
const lexer = require('./true-lexer');

print = (message, callback) => process.stdout.write(message, callback);

if (argv.length < 3) {
    print("USAGE: node src/kernel.js pathToFile.asmX\n");
    exit(1);
}

let fname = argv[2];
let fileContents = fs.readFileSync(fname, { encoding: 'utf8' });
let tokens = lexer(fileContents);
console.log(tokens);
let parser = Parser.parse(fileContents);
new Compiler(parser);