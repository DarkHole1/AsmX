const keywords = [
    '@invoke',
    '@route',
    '@memory',
    '@address',
    '@set',
    '@stack',
    '@issue',
    '@add',
    '@sub',
    '@equal',
    '@equ',
    '@unit',
    '@call',
    '@ret',
    '@import',
    '@shift'
]

module.exports = function lexer(source) {
    let tokens = [];
    let current = source;
    while (current.length > 0) {
        // Spaces (skip they)
        let match = current.match(/^\s+/);
        if (match) {
            current = current.slice(match[0].length);
            continue;
        }

        // Empty line
        match = current.match(/^\r?\n/);
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "empty_line" });
            continue;
        }

        // Comment
        match = current.match(/^#(.+)$/m)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "comment", text: match[1] });
            continue;
        }
        // Keyword
        match = current.match(/^\@([A-Z0-9]+)/i)
        if (match && keywords.includes(match[0].toLowerCase())) {
            // console.log("Match %o", match[0]);
            // console.log(current.slice(0, match[0].length));
            current = current.slice(match[0].length);
            tokens.push({ type: "keyword", keyword: match[0].toLowerCase() });
            continue;
        }
        // Identifier (can't start from digit)
        match = current.match(/^[A-Z][A-Z0-9]*/i)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "identifier", text: match[0] });
            continue;
        }
        // Variable (or wtf)
        match = current.match(/^\$[A-Z][A-Z0-9]*/i)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "variable", text: match[0] });
            continue;
        }
        // Number literal
        match = current.match(/^(0x\d+|\d+)/i)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "literal", value: parseInt(match[0]) });
            continue;
        }
        // Boolean literal
        match = current.match(/^(true|false)/)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "literal", value: match[0] == 'true' });
            continue;
        }
        // String literal
        match = current.match(/^".+?"/)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "literal", value: match[1] });
            continue;
        }
        // Blah blah blah
        match = current.match(/^\(/)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "lparen" });
            continue;
        }
        match = current.match(/^\)/)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "rparen" });
            continue;
        }
        match = current.match(/^\,/)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "comma" });
            continue;
        }
        match = current.match(/^;/)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "semicolon" });
            continue;
        }
        match = current.match(/^:/)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "colon" });
            continue;
        }
        match = current.match(/^\[/)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "lbracket" });
            continue;
        }
        match = current.match(/^\]/)
        if (match) {
            current = current.slice(match[0].length);
            tokens.push({ type: "rbracket" });
            continue;
        }

        console.log(current);
        throw "Can't lex :(";
    }
    return tokens;
}