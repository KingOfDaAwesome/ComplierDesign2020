import { Token } from "./Token"
import { Grammar } from "./Grammar"

export class Tokenizer {
    gram: Grammar
    input: string
    idx: number
    lineNumber: number
    tokens: Map<Number, Token>

    constructor(g) {
        this.gram = g;
        this.idx = 0;
        this.lineNumber = 1;
        this.tokens = new Map();
    }
    setInput(s) {
        this.input = s + "$";
        this.idx = 0;
        this.lineNumber = 1;
        this.tokens = new Map();
    }
    next() {
        if (this.input.length == 1) {
            //console.log("input")
            //console.log(this.input)
            this.tokens.set(this.tokens.size + 1, new Token("$", undefined, this.lineNumber));
            this.input = '';
            return new Token("$", undefined, this.lineNumber)
        }
        //console.log("input")
        //console.log(this.input)
        for (let i = 0; i < this.gram.term.length; ++i) {
            //console.log("x");
            //console.log(this.input.substring(this.idx, this.input.length));
            /*if (this.input.substring(this.idx, this.input.length) == "\n") {
                console.log("pllt")
                this.lineNumber += 1;
                this.idx += 2;
            }*/
            let term = this.gram.term[i];
            //console.log("potato")
            //console.log("term")
            //console.log(term)
            let sym = term.sym;
            //console.log("sym")
            //console.log(sym)
            let reg = new RegExp(term.reg)
            //console.log("reg")
            //console.log(reg);
            //console.log(this.idx);
            reg.lastIndex = this.idx;
            //console.log(reg.lastIndex);
            let q = reg.exec(this.input);
            //let q = reg.exec(this.input[this.idx]);
            //let q = reg.exec(this.input.substring(this.idx));
            //console.log(this.input.substring(this.idx))
            //console.log(this.input[this.idx])
            //console.log(this.input)
            
            if (q && q[0] == this.input.substring(0,q[0].length)) {
                //console.log("here")
                let lex = q[0];
                this.input = this.input.substring(lex.length);
                if (sym !== "WHITESPACE" && sym !== "COMMENT" && sym !== "NEWLINE") {
                    //console.log(new Token(sym, lex, this.lineNumber))
                    
                    this.idx += 1;
                    //this.tokens.set(this.idx, new Token(sym, lex, this.lineNumber));
                    let tok = new Token(sym, lex, this.lineNumber);
                    let regz = new RegExp("\n");
                    let nl = regz.exec(q[0]);
                    if (nl) {
                        this.lineNumber += 1;
                    }
                    //console.log(tok)
                    //console.log(this.tokens)
                    this.tokens.set(this.tokens.size+1, tok);
                    return tok;
                }
                else {
                    if (sym == "NEWLINE") { 
                    this.idx += 2;
                    this.lineNumber += 1;
                }
                    if (sym == "WHITESPACE")
                        this.idx += 1;
                    return this.next();
                }
            }
        }
    }
    walk() {
        while (this.next() != null)
            //console.log("walk")
            this.next()
    }
}