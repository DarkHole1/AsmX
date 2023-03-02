const fs = require('fs');
const Parser = require('./parser');
const Compiler = require('./compiler');
const { argv, exit } = require('process');

print = (message, callback) => process.stdout.write(message, callback);

if (argv.length < 3) {
    print("USAGE: node src/kernel.js pathToFile.asmX\n");
    exit(1);
}

let fname = argv[2];
let file = fs.readFileSync(fname, { encoding: 'utf8' });
let parser = Parser.parse(file);
new Compiler(parser);