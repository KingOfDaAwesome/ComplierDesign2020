export class Grammar {
    term: Terminal[]
    nonterm: Map<String, String>
    gramString: string
    productions: Map<String, String>

    constructor(s) {
        //console.log("a")
        //console.log(s)
        this.gramString = s;
        this.productions = new Map();
        this.nonterm = new Map();
        this.term = []
        this.findGrammar();

    }

    findGrammar() {
        console.log(this.gramString);
        let x = this.gramString.split("\n");
        //console.log("hdasjl")
        //console.log(x);
        for (let p of x) {
            let a = p.split(" -> ");
            this.productions.set(a[0], a[1]);
            if (a[0].toLowerCase() == a[0]) {
                this.nonterm.set(a[0], a[1])
            }
            else {
                let rex = RegExp(a[1])
               //console.log("che")
                //console.log(rex);
                this.term.push(new Terminal(a[0], a[1]))
            }
        }

        this.term.push(new Terminal("NEWLINE", new RegExp("\n")));
        this.term.push(new Terminal("WHITESPACE", new RegExp(" ")));
        console.log(this.nonterm)
        console.log(",.")
        console.log(this.term)
    }
}
export class Terminal {
    sym: string
    reg: RegExp

    constructor(s, r) {
        this.sym = s;
        this.reg = r;
    }
}