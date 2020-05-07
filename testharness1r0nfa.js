"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require("fs");
const LR_1 = require("./LR");
class State {
}
class Test {
}
function main() {
    let tests = JSON.parse(fs.readFileSync("tests.txt", "utf8"));
    tests.forEach((t) => {
        console.log(t.name);
        let nfa = LR_1.makeNFA(t.grammar);
        let dot = outputDot(nfa);
        fs.writeFileSync(t.name + ".dot", dot);
    });
}
function outputDot(fa) {
    let L;
    L = [];
    L.push("digraph d{");
    L.push("node [fontname=Helvetica,shape=box];");
    L.push("edge [fontname=Helvetica];");
    fa.forEach((q, i) => {
        let x = q.item.toString();
        x = x.replace(/&/g, "&amp;");
        x = x.replace(/</g, "&lt;");
        x = x.replace(/>/g, "&gt;");
        L.push("n" + i + " [label=<" + i + "<br />" + x + ">];");
    });
    fa.forEach((q, i) => {
        for (let sym of q.transitions.keys()) {
            let sym1;
            if (sym === "")
                sym1 = "<&lambda;>";
            else
                sym1 = "\"" + sym + "\"";
            let L2 = q.transitions.get(sym);
            L2.forEach((i2) => {
                L.push("n" + i + " -> n" + i2 + " [label=" + sym1 + "];");
            });
        }
    });
    L.push("}");
    return L.join("\n");
}
main();
//# sourceMappingURL=testharness1r0nfa.js.map