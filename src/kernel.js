const fs = require('fs');
const readline = require('readline');

const Parser = require('./parser');
const Compiler = require('./compiler');

print = (message, callback) => process.stdout.write(message, callback);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

print('COMPILER x64 asm');
rl.question('MarsX file compiler asmX ~' , (answer) => {
    print(answer);
    
    if (answer.endsWith('.asmx') || answer.endsWith('.asmX')) {
        print('\nCOMPILING asmX FILE...\n');

        new CompilerAsmX({ src: answer });

        rl.close();
    } else {
        print('\nINVALID EXTENSION FILE\n');
    }
});


class CompilerAsmX {
    constructor(config) {
        this.config = config;
        this.tokens = [];
        let file = fs.readFileSync(this.config.src, { encoding: 'utf8' });
        let parser = Parser.parse(file);
        new Compiler(parser);
    }
}