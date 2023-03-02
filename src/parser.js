const { TypeError } = require("./anatomics.errors");
const ValidatorByType = require("./checker");
const Lexer = require("./lexer");
const Validator = require("./validator");

class Parser {
    static parse(sourceCode, tokens) {
        let lines = sourceCode.split('\n');
        let ast = {
            type: "Program",
            body: []
        };
        let current = tokens;
        lines = lines.flatMap(line => line.split(';'));

        while (current.length > 0) {
            if (current[0].type == 'semicolon' || current[0].type == 'comment') {
                current = current.slice(1);
                continue;
            }

            let [subAst, newCurrent] = this.parseUnitStatement(current);
            if (subAst) {
                current = newCurrent;
                ast.body.push(subAst);
                continue;
            }

            // if (Validator.isImportStatement(current)) {
            //     let alias = this.parseImportStatement(current);
            //     if (alias == 'rejected') { break ParserCycle; } else ast.push(alias);
            //     continue;
            // }

            // if (Validator.isReturnStatement(current)) {
            //     let ret = this.parseReturnStatement(current);
            //     if (ret == 'rejected') { break ParserCycle; } else ast.push(ret);
            //     continue;
            // }

            // if (Validator.isCallStatement(current)) {
            //     let call = this.parseCallStatement(current);
            //     if (call == 'rejected') { break ParserCycle; } else ast.push(call);
            //     continue;
            // }

            [subAst, newCurrent] = this.parseIssueStatement(current);
            if (subAst) {
                current = newCurrent;
                ast.body.push(subAst);
                continue;
            }

            // if (Validator.isSetDeclaration(current)) {
            //     let set = this.parseSetStatement(current)
            //     if (set == 'rejected') { break ParserCycle; } else ast.push(set);
            //     continue;
            // }

            // if (Validator.isInvokeStatement(current)) {
            //     let invoke = this.parseInvokeStatement(current);
            //     if (invoke == 'rejected') { break ParserCycle; } else ast.push(invoke);
            //     continue;
            // }

            // if (Validator.isMemoryInvokeStatement(current)) {
            //     let memory = this.parseMemoryInvoke(current);
            //     if (memory == 'rejected') { break ParserCycle; } else ast.push(memory);
            //     continue;
            // }

            // if (Validator.isAddressInvokeStatement(current)) {
            //     let address = this.parseAddressInvoke(current);
            //     if (address == 'rejected') { break ParserCycle; } else ast.push(address);
            //     continue;
            // }

            // if (Validator.isRouteStatement(current)) {
            //     let route = this.parseRouteStatement(current);
            //     if (route == 'rejected') { break ParserCycle; } else ast.push(route);
            //     continue;
            // }

            // if (Validator.isStackStatement(current)) {
            //     let stack = this.parseStackStatement(current);
            //     if (stack == 'rejected') { break ParserCycle; } else ast.push(stack);
            //     continue;
            // }

            // if (Validator.isAddStatement(current)) {
            //     let add = this.parseAddStatement(current);
            //     if (add == 'rejected') { break ParserCycle; } else ast.push(add);
            //     continue;
            // }

            // if (Validator.isSubStatement(current)) {
            //     let sub = this.parseSubStatement(current);
            //     if (sub == 'rejected') { break ParserCycle; } else ast.push(sub);
            //     continue;
            // }

            // if (Validator.isCallStatement(current)) {
            //     let call = this.parseCallStatement(current);
            //     if (call == 'rejected') { break ParserCycle; } else ast.push(call);
            //     continue;
            // }

            // if (Validator.isEqualStatement(current)) {
            //     let equal = this.parseEqualityStatement(current);
            //     if (equal == 'rejected') { break ParserCycle; } else ast.push(equal);
            //     continue;
            // }

            // if (Validator.isDivStatement(current)) {
            //     let div = this.parseDivStatement(current);
            //     if (div == 'rejected') { break ParserCycle; } else ast.push(div);
            //     continue;
            // }

            // if (Validator.isModStatement(current)) {
            //     let mod = this.parseModStatement(current);
            //     if (mod == 'rejected') { break ParserCycle; } else ast.push(mod);
            //     continue;
            // }
            console.log(current);
            throw "Can't parse: nothing matches";
        }

        return ast;
    }


    static parseImportStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['import'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        const [ImportToken, Alias] = lineCode.split(' ');
        if (lineCode.split(' ').length > 2) return 'rejected';
        if (Alias == undefined) { process.stdout.write('Alias not defined'); return 'rejected'; }
        else smallAbstractSyntaxTree['import']['alias'] = Alias;
        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a line of code, splits it into two parts, and returns an object with the second part as
     * a property of the first part
     * @param lineCode - The line of code that is being parsed.
     * @returns a small abstract syntax tree.
     */
    static parseReturnStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['ret'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        const [RetToken, RetAddress] = lineCode.split(' ');
        if (lineCode.split(' ').length > 2) return 'rejected';
        if (RetAddress == undefined) console.error('Invoke address not found');
        else smallAbstractSyntaxTree['ret']['arg'] = RetAddress;
        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a line of code, splits it into an array of arguments, and then validates each argument
     * @param lineCode - the line of code that is being parsed
     * @returns A small abstract syntax tree.
     */
    static parseDivStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['div'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        if (lineCode.split(' ').length > 6) return 'rejected';
        let args = lineCode.indexOf(',') > -1 ? lineCode.split(',') : lineCode.split(' ');
        args = args.map(arg => arg.indexOf(' ') > -1 ? arg.split(' ')[1] : arg);
        args.map(arg => ValidatorByType.validateTypeHex(arg));
        smallAbstractSyntaxTree['div']['args'] = args;
        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a line of code, splits it into arguments, and then validates each argument.
     * @param lineCode - the line of code that is being parsed
     * @returns a small abstract syntax tree.
     */
    static parseModStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['mod'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        if (lineCode.split(' ').length > 6) return 'rejected';
        let args = lineCode.indexOf(',') > -1 ? lineCode.split(',') : lineCode.split(' ');
        args = args.map(arg => arg.indexOf(' ') > -1 ? arg.split(' ')[1] : arg);
        args.map(arg => ValidatorByType.validateTypeHex(arg));
        smallAbstractSyntaxTree['mod']['args'] = args;
        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a line of code, splits it into an array of arguments, and returns an object with the
     * arguments as properties.
     * @param lineCode - the line of code that is being parsed
     * @returns An object with a key of 'add' and a value of an object with a key of 'args' and a value
     * of an array of arguments.
     */
    static parseEqualityStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['equal'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        if (lineCode.split(' ').length > 6) return 'rejected';
        let args = lineCode.indexOf(',') > -1 ? lineCode.split(',') : lineCode.split(' ');
        args = args.map(arg => arg.indexOf(' ') > -1 ? arg.split(' ')[1] : arg);
        smallAbstractSyntaxTree['equal']['args'] = args;
        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a line of code, splits it into an array of arguments, and returns an object with the
     * arguments as properties.
     * @param lineCode - the line of code that is being parsed
     * @returns an object.
     */
    static parseAddStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['add'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        if (lineCode.split(' ').length > 6) return 'rejected';
        let args = lineCode.indexOf(',') > -1 ? lineCode.split(',') : lineCode.split(' ');
        args = args.map(arg => arg.indexOf(' ') > -1 ? arg.split(' ')[1] : arg);
        args.map(arg => ValidatorByType.validateTypeHex(arg));
        smallAbstractSyntaxTree['add']['args'] = args;
        return smallAbstractSyntaxTree;
    }



    /**
     * It takes a line of code and returns an object with the name of the function and the arguments
     * @param lineCode - the line of code that is being parsed
     * @returns a small abstract syntax tree.
     */
    static parseCallStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['call'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        if (lineCode.split(' ').length > 2) return 'rejected';
        const unitName = lineCode.substring(lineCode.indexOf(' ') + 1, lineCode.indexOf('('));
        const unitArguments = lineCode.substring(lineCode.indexOf('('), lineCode.indexOf(')') + 1);
        smallAbstractSyntaxTree['call']['name'] = unitName;
        smallAbstractSyntaxTree['call']['args'] = unitArguments;
        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a line of code and returns an object with the sub statement and its arguments.
     * @param lineCode - the line of code that is being parsed
     * @returns An object with a key of 'sub' and a value of an object with a key of 'args' and a value
     * of an array of arguments.
     */
    static parseSubStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['sub'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        if (lineCode.split(' ').length > 6) return 'rejected';
        let args = lineCode.indexOf(',') > -1 ? lineCode.split(',') : lineCode.split(' ');
        args = args.map(arg => arg.indexOf(' ') > -1 ? arg.split(' ')[1] : arg);
        args.map(arg => ValidatorByType.validatorTypeHex(arg));
        smallAbstractSyntaxTree['sub']['args'] = args;
        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a string, splits it into an array, and then assigns the array elements to variables.
     * @param lineCode - The line of code that is being parsed.
     * @returns An object with a key of route and a value of an object with keys of name and address.
     */
    static parseRouteStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['route'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        if (lineCode.split(' ').length > 3) return 'rejected';
        const [RouteToken, RouteName, RouteAddress] = lineCode.split(' ');

        if (RouteAddress && !ValidatorByType.validateTypeHex(RouteAddress)) {
            new TypeError(lineCode, RouteAddress);
            return 'rejected';
        }

        smallAbstractSyntaxTree['route']['name'] = RouteName;
        smallAbstractSyntaxTree['route']['address'] = RouteAddress;
        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a line of code, splits it into two parts, and returns an object with the second part as
     * a property of the first part.
     * @param lineCode - the line of code that is being parsed
     * @returns an object with a key of 'stack' and a value of an object with a key of 'address' and a
     * value of the stack address.
     */
    static parseStackStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['stack'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        const [StackToken, StackAddress] = lineCode.split(' ');
        if (lineCode.split(' ').length > 2) return 'rejected';

        if (!ValidatorByType.validateTypeHex(StackAddress)) {
            new TypeError(lineCode, StackAddress);
            return 'rejected';
        }

        smallAbstractSyntaxTree['stack']['address'] = StackAddress;
        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a string, splits it into two parts, and returns an object with the two parts as
     * properties.
     * @param lineCode - The line of code that is being parsed
     * @returns An array of objects.
     */
    static parseIssueStatement(tokens) {
        let subAst = {
            type: 'issue',
            state: false
        };
        if (tokens[0].type != 'keyword' || tokens[0].keyword != '@issue') {
            return [null, tokens];
        }
        if (tokens[1].type != 'literal' || typeof tokens[1].value != 'boolean') {
            throw `Expecter bool literal but got ${tokens[1].type}`;
        }
        subAst.state = tokens[1].value;
        return [subAst, tokens.slice(2)];
    }


    /**
     * It takes a string and replaces all the empty characters with a single space.
     * @param lineCode - The line of code that is being parsed.
     * @returns The line of code with all the empty characters removed.
     */
    static parseAndDeleteEmptyCharacters(lineCode) {
        lineCode = lineCode.replace(/\s+/g, ' ').trim();
        return lineCode.substring(0, lineCode.indexOf('#') >= 0 ? lineCode.indexOf('#') - 1 : lineCode.length);
    }


    /**
     * It takes a line of code, splits it into an array, and then assigns the values of the array to a
     * JSON object.
     * </code>
     * @param lineCode - The line of code that is being parsed.
     * @returns An array of objects.
     */
    static parseSetStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['set'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        const [setToken, setName, setType, setValue] = lineCode.split(' ');
        if (lineCode.split(' ').length > 4) return 'rejected';

        if (setValue == undefined) {
            Lexer.lexerAutonomyByType(lineCode, setType, Lexer.lexerGetTypeByValue(lineCode, setType));
            smallAbstractSyntaxTree['set']['name'] = setName;
            smallAbstractSyntaxTree['set']['type'] = Lexer.lexerGetTypeByValue(lineCode, setType);
            smallAbstractSyntaxTree['set']['value'] = setType;
        } else {
            Lexer.lexerAutonomyByType(lineCode, setValue, setType);
            smallAbstractSyntaxTree['set']['name'] = setName;
            smallAbstractSyntaxTree['set']['type'] = setType;
            smallAbstractSyntaxTree['set']['value'] = setValue;
        }

        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a line of code, splits it into two parts, and then returns an object with the two parts
     * as properties.
     * @param lineCode - The line of code that is being parsed.
     * @returns An array of objects.
     */
    static parseInvokeStatement(lineCode) {
        let smallAbstractSyntaxTree = {};
        smallAbstractSyntaxTree['invoke'] = {};
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        const [InvokeToken, InvokeAddress] = lineCode.split(' ');
        if (lineCode.split(' ').length > 2) return 'rejected';

        if (!ValidatorByType.validateTypeHex(InvokeAddress)) {
            new TypeError(lineCode, InvokeAddress);
            return 'rejected';
        }

        if (InvokeAddress == undefined) console.error('Invoke address not found');
        else smallAbstractSyntaxTree['invoke']['address'] = InvokeAddress;
        return smallAbstractSyntaxTree;
    }


    /**
     * It takes a line of code, parses it, and then sets the memory address to the value.
     * </code>
     * @param lineCode - The line of code that is being parsed.
     */
    static parseMemoryInvoke(lineCode) {
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        const [memoryToken, memoryValue, memoryAddress] = lineCode.split(' ');
        if (lineCode.split(' ').length > 3) return 'rejected';

        if (!ValidatorByType.validateTypeHex(memoryAddress)) {
            new TypeError(lineCode, memoryAddress);
            return 'rejected';
        }

        Lexer.lexerMemoryAddress(lineCode, memoryAddress);
        return { memory: { name: memoryValue, address: memoryAddress } };
    }


    /**
     * It takes a string, finds the first and last parentheses, and returns an object with the string
     * between the parentheses as the ref property and the string after the last parentheses as the
     * addressVal property.
     * @param lineCode - The line of code that is being parsed.
     * @returns An object with two properties: ref and addressVal.
     */
    static parseAddressInvoke(lineCode) {
        lineCode = this.parseAndDeleteEmptyCharacters(lineCode);
        if (lineCode.indexOf('(') !== -1 && lineCode.indexOf(')') !== -1) {
            const addressName = lineCode.substring(lineCode.indexOf('('), lineCode.lastIndexOf(')')).trim();
            const address = lineCode.substring(lineCode.lastIndexOf(')')).trim();
            return { address: { name: addressName, address: address } };
        } else {
            const [addressToken, address, addressName] = lineCode.split(' ');
            return { address: { name: addressName, address: address } };
        }
    }


    /**
     * It takes a string of arguments and returns an object with the argument index as the key and the
     * argument type as the value
     * @param args - The arguments that are passed to the function.
     * @returns An object with the index of the argument as the key and the type of the argument as the
     * value.
     */
    static parseTypesArgumentsUnit(args) {
        args = args.trim().split(",");
        let argsRules = {};
        let argsTypes = [];
        for (let index = 0; index < args.length; index++) argsTypes.push(args[index].split(':'));
        for (let index = 0; index < argsTypes.length; index++) argsRules[index] = argsTypes[index][1].trim() || 'Any';
        return argsRules;
    }


    /**
     * It takes a string of arguments, splits them into an array, splits each argument into a key and
     * value, and returns an array of the keys
     * @param args - The arguments that are passed to the function.
     * @returns An array of strings.
     */
    static parseNamesArgumentsUnit(args) {
        args = args.trim().split(",");
        let argsParse = [];
        let argsNames = [];
        for (let index = 0; index < args.length; index++) argsParse.push(args[index].split(':'));
        for (let index = 0; index < argsParse.length; index++) argsNames.push(argsParse[index][0].trim());
        return argsNames;
    }


    /**
     * It takes a string, and returns an array of three strings.
     * @param tokens - the line of code that is being parsed
     * @returns An array of three elements.
     */
    static parseUnitStatement(tokens) {
        let subAst = {
            type: 'unit',
            name: '',
            arguments: [],
            body: []
        };
        if (tokens[0].type != 'keyword' || tokens[0].keyword != '@unit') {
            return [null, tokens];
        }
        if (tokens[1].type != 'identifier') {
            throw `Identifier expected but ${tokens[1].type} found`;
        }
        subAst.name = tokens[1].text;
        if (tokens[2].type != 'lparen') {
            throw `Parenthesis expected but ${tokens[2].type} found`;
        }
        let current = 2;
        while (true) {
            if (tokens[current].type != 'identifier') {
                throw `Identifier expected but ${tokens[current].type} found`;
            }
            if (tokens[current + 1].type != 'colon') {
                throw `Colon expected but ${tokens[current + 1].type} found`;
            }
            if (tokens[current + 2].type != 'identifier') {
                throw `Identifier expected but ${tokens[current + 2].type} found`;
            }
            subAst.arguments.push({
                name: tokens[current],
                type: tokens[current + 2]
            })
            if (tokens[current + 3].type == 'rparen') {
                current += 4;
                break;
            }
            if (tokens[current + 3].type == 'comma') {
                current += 4;
                continue;
            }
            throw `Expected colon or parenthesis but ${tokens[current + 3].type} found`;
        }
        if (tokens[current].type != 'colon') {
            throw `Expected colon but ${tokens[current + 3].type} found`;
        }
        current += 1;
        return [subAst, tokens.slice(current)];
    }
}

module.exports = Parser;