"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Grammar {
    constructor(s) {
        //console.log("a")
        //console.log(s)
        this.gramString = s;
        this.productions = new Map();
        this.nonterm = new Map();
        this.lhs = new Array();
        this.rhs = new Array();
        this.term = [];
        //console.log("pllt2");
        this.findGrammar();
        this.Nullable = new Set();
        //console.log("pllt");
    }
    findGrammar() {
        //console.log("here2")
        console.log(this.gramString);
        let x = this.gramString.split("\n");
        //console.log("x")
        //console.log(x);
        let q = true;
        for (let p of x) {
            //console.log("a")
            let a = p.split(" -> ");
            //console.log(a);
            this.productions.set(a[0], a[1]);
            if (a[0] != "")
                this.lhs.push(a[0]);
            if (a[0].length != 0) {
                let b = a[1].split("|");
                //console.log("b");
                //console.log(b);
                for (let c of b) {
                    //console.log("here5")
                    if (!q) {
                        //console.log("c")
                        //console.log(c.split(" "))
                        for (let r of c.split(" ")) {
                            //console.log("r")
                            //console.log(r)
                            if (r != "")
                                this.rhs.push(r);
                        }
                    }
                }
            }
            //console.log("plly")
            //console.log(p.length);
            //console.log(q);
            if (p.length == 0) {
                //console.log("here6")
                q = false;
            }
            else {
                if (!q) {
                    //console.log("here7")
                    this.nonterm.set(a[0], a[1]);
                }
                else {
                    //console.log("here9")
                    let rex = RegExp(a[1]);
                    //console.log("che")
                    //console.log(rex);
                    this.term.push(new Terminal(a[0], a[1]));
                }
            }
        }
        this.term.push(new Terminal("NEWLINE", new RegExp("\n")));
        this.term.push(new Terminal("WHITESPACE", new RegExp(" ")));
        //console.log("here3");
        //console.log(this.nonterm)
        //console.log(",.")
        //console.log(this.term)
        //this.checkingValid();
    }
    checkingValid() {
        //console.log("lhs");
        //console.log(this.lhs);
        //console.log("rhs");
        //console.log(this.rhs);
        for (let e of this.rhs) {
            //console.log(e)
            let m = e.split(" ");
            //console.log("m")
            //console.log(m)
            for (let z of m) {
                let v = false;
                if (z != "") {
                    //console.log("z")
                    //console.log(z)
                    for (let l of this.lhs) {
                        if (z == l) {
                            v = true;
                        }
                        //console.log("l")
                        //console.log(l)
                        //console.log("z")
                        //console.log(z)
                        //console.log(v)
                        if (v)
                            break;
                    }
                    if (!v)
                        throw new Error("a rhs peice doesnt have a corrispoing lhs");
                }
            }
        }
        for (let e of this.lhs) {
            let v = false;
            for (let r of this.rhs) {
                if (r == e) {
                    v = true;
                }
            }
            if (!v)
                throw new Error("a lhs can not be reach");
        }
    }
    getNullable() {
        let cha = true;
        while (cha) {
            let x = this.Nullable.size;
            for (let lhs of this.nonterm) {
                //console.log(lhs.toString())
                let rhs = lhs.toString().split(",")[1];
                //console.log(rhs)
                let prod = rhs.split("|");
                //console.log(prod)
                for (let p of prod) {
                    //console.log(p)
                    if (p == " lambda" || p == "" || p == "lambda ")
                        this.Nullable.add(lhs.toString().split(",")[0]);
                }
            }
            for (let lhs of this.nonterm) {
                console.log("lhs");
                console.log(lhs.toString());
                let rhs = lhs.toString().split(",")[1];
                console.log("rhs");
                console.log(rhs);
                let prod = rhs.split("|");
                console.log("prod");
                console.log(prod);
                for (let p of prod) {
                    console.log("p");
                    console.log(p);
                    console.log(p.split(" "));
                    let n = true;
                    for (let M of p.split(" ")) {
                        console.log("M");
                        console.log(M);
                        if (M != "")
                            if (this.Nullable.has(M.replace(" ", ""))) {
                                console.log("herehere");
                            }
                            else {
                                console.log("nope");
                                n = false;
                            }
                    }
                    if (n)
                        this.Nullable.add(lhs.toString().split(",")[0]);
                }
            }
            if (x == this.Nullable.size)
                cha = false;
            console.log("nullable");
            console.log(this.Nullable);
            console.log("\n\n\n\n\n");
        }
        console.log("nullable");
        console.log(this.Nullable);
        console.log("\n\n\n\n\n");
        return this.Nullable;
    }
}
exports.Grammar = Grammar;
class Terminal {
    constructor(s, r) {
        this.sym = s;
        this.reg = r;
    }
}
exports.Terminal = Terminal;
//# sourceMappingURL=Grammar.js.map