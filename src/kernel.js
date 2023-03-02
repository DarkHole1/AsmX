const fs = require('fs');
const Parser = require('./parser');
const Compiler = require('./compiler');
const { argv, exit } = require('process');

print = (message, callback) => process.stdout.write(message, callback);

if (argv.length < 1) {
    print("USAGE: node src/kernel.js file.asmX");
    exit(1);
}

let fname = argv[1];
new CompilerAsmX({ src: fname });


class CompilerAsmX {
    constructor(config) {
        this.config = config;
        this.tokens = [];
        let file = fs.readFileSync(this.config.src, { encoding: 'utf8' });
        let parser = Parser.parse(file);
        new Compiler(parser);
    }
}