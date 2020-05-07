"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require("fs");
const LR_1 = require("./LR");
class NFAState {
}
class DFAState {
}
class Test {
}
function main() {
    let tests = JSON.parse(fs.readFileSync("tests.txt", "utf8"));
    tests.forEach((t) => {
        console.log(t.name);
        let nfa = LR_1.makeNFA(t.grammar);
        let dfa = LR_1.makeDFA(t.grammar);
        let dot = outputDotNFA(nfa);
        fs.writeFileSync(t.name + ".nfa.dot", dot);
        dot = outputDotDFA(dfa, nfa);
        fs.writeFileSync(t.name + ".dfa.dot", dot);
    });
}
function outputDotNFA(fa) {
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
function outputDotDFA(dfa, nfa) {
    let L;
    L = [];
    L.push("digraph d{");
    L.push("node [fontname=Helvetica,shape=box];");
    L.push("edge [fontname=Helvetica];");
    dfa.forEach((q, i) => {
        let s = [];
        q.label.forEach((nfaStateIndex) => {
            let nq = nfa[nfaStateIndex];
            let x = nq.item.toString();
            x += " [" + nfaStateIndex + "]";
            x = x.replace(/&/g, "&amp;");
            x = x.replace(/</g, "&lt;");
            x = x.replace(/>/g, "&gt;");
            s.push(x);
        });
        s.sort();
        L.push("n" + i + " [label=<" + i + "<br />" + s.join("<br />") + ">];");
    });
    dfa.forEach((q, i) => {
        for (let sym of q.transitions.keys()) {
            let sym1;
            if (sym === "")
                sym1 = "<&lambda;>";
            else
                sym1 = "\"" + sym + "\"";
            let i2 = q.transitions.get(sym);
            L.push("n" + i + " -> n" + i2 + " [label=" + sym1 + "];");
        }
    });
    L.push("}");
    return L.join("\n");
}
main();
//# sourceMappingURL=testharness dfa.js.map