"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("./Grammar");
var gram;
var StateMap;
var DFaMap;
function makeNFA(string) {
    gram = new Grammar_1.Grammar(string);
    gram.findGrammar();
    console.log(gram.nonterm);
    let startsymbol = gram.startSymbol;
    console.log(startsymbol);
    let startState = new NFAState(new LR0Item("S'", [startsymbol], 0));
    let allState = [];
    allState.push(startState);
    StateMap = new Map();
    DFaMap = new Map();
    let todo = [0];
    while (todo.length > 0) {
        let qi = todo.pop();
        let q = allState[qi];
        makeTransitions(q, allState, todo, StateMap);
    }
    return allState;
}
exports.makeNFA = makeNFA;
function makeDFA(string) {
    let nfa = makeNFA(string);
    for (let ns = 0; ns < nfa.length; ns++) {
        //console.log(nfa[ns])
        //console.log(ns)
        //console.log(nfa[ns].closure)
        computeClosure(nfa, ns, nfa[ns].closure);
    }
    //computeClosure(nfa,0,nfa[0].closure)
    let startsymbol = gram.startSymbol;
    //let startState = new DFAState(new LR0Item("S'", [startsymbol], 0));
    let dfa = [];
    let StateMap = new Map();
    dfa.push(new DFAState(nfa[0].closure));
    let toDo = [0];
    while (toDo.length > 0) {
        console.log("hi");
        let qi = toDo.pop();
        let q = dfa[qi];
        processState(q, nfa, dfa, toDo);
    }
    return dfa;
}
exports.makeDFA = makeDFA;
function processState(q, nfa, dfa, toDo) {
    //console.log("here")
    console.log(q);
    console.log(nfa);
    console.log(dfa);
    console.log(toDo);
    let r = collectTransitions(q, nfa);
    console.log(r);
    for (let l of r) {
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log(l);
        let f = getDfaStateWithLabel(l[1], dfa, toDo);
        q.addTransition(l[0], f);
    }
}
exports.processState = processState;
function collectTransitions(q, nfa) {
    let r = new Map();
    q.label.forEach((nfaStateIndex) => {
        let nq = nfa[nfaStateIndex];
        for (let sym of nq.transitions.keys()) {
            if (sym != "" && sym != "lambda") {
                if (!r.has(sym))
                    r.set(sym, new Set());
                nq.transitions.get(sym).forEach((x) => {
                    let nq2 = nfa[x];
                    r.set(sym, union(r.get(sym), nq2.closure));
                });
            }
        }
    });
    return r;
}
exports.collectTransitions = collectTransitions;
function getDfaStateWithLabel(q, dfa, toDo) {
    let r2s = setToString(q);
    let z;
    if (DFaMap.has(r2s)) {
        z = DFaMap.get(r2s);
    }
    else {
        z = dfa.length;
        dfa.push(new DFAState(q));
        toDo.push(z);
        DFaMap.set(r2s, z);
    }
    return z;
}
exports.getDfaStateWithLabel = getDfaStateWithLabel;
function union(set1, set2) {
    for (let x of set2)
        set1.add(x);
    return set1;
}
exports.union = union;
function computeClosure(nfa, stateIndex, closure) {
    closure.add(stateIndex);
    if (nfa[stateIndex].transitions.has("")) {
        nfa[stateIndex].transitions.get("").forEach((index) => {
            if (!closure.has(index)) {
                computeClosure(nfa, index, closure);
            }
        });
    }
    //console.log(closure)
}
exports.computeClosure = computeClosure;
function makeTransitions(q, allstate, toDo, stateMap) {
    if (q.item.dpos == q.item.rhs.length) {
        return;
    }
    let sym = q.item.rhs[q.item.dpos];
    //console.log(q.item.rhs)
    let I2 = new LR0Item(q.item.lhs, q.item.rhs, q.item.dpos + 1);
    //console.log("shuffledpos")
    //console.log(I2.toString())
    let q2i = getStateWithLabel(I2, allstate, toDo, stateMap);
    q.addTransition(sym, q2i);
    if (gram.nonterm.has(sym)) {
        for (let P of gram.nonterm.get(sym).split(" | ")) {
            //console.log(P)
            I2 = new LR0Item(sym, P.replace("lamdba", "").split(" "), 0);
            //console.log("newOneBasedOnProductions")
            //console.log(I2.toString())
            let q2i = getStateWithLabel(I2, allstate, toDo, stateMap);
            q.addTransition("", q2i);
        }
    }
}
exports.makeTransitions = makeTransitions;
function getStateWithLabel(I2, allstates, toDo, stateMap) {
    let I2s = I2.toString();
    let q2i;
    if (stateMap.has(I2s)) {
        q2i = stateMap.get(I2s);
    }
    else {
        q2i = allstates.length;
        allstates.push(new NFAState(I2));
        toDo.push(q2i);
        stateMap.set(I2s, q2i);
    }
    return q2i;
}
exports.getStateWithLabel = getStateWithLabel;
function setToString(s) {
    let L = [];
    s.forEach((x) => {
        L.push(x.toString());
    });
    L.sort();
    return L.join(" ");
}
exports.setToString = setToString;
class NFAState {
    constructor(lr0item) {
        this.item = lr0item;
        this.transitions = new Map();
        this.closure = new Set();
    }
    addTransition(sym, stateIndex) {
        if (!this.transitions.has(sym))
            this.transitions.set(sym, []);
        this.transitions.get(sym).push(stateIndex);
    }
}
exports.NFAState = NFAState;
class DFAState {
    constructor(label) {
        this.label = label;
        this.transitions = new Map();
    }
    addTransition(sym, stateIndex) {
        if (this.transitions.has(sym))
            throw new Error("Duplicate transition");
        this.transitions.set(sym, stateIndex);
    }
}
exports.DFAState = DFAState;
class LR0Item {
    constructor(lhs, rhs, dpos) {
        this.lhs = lhs;
        this.rhs = rhs;
        this.dpos = dpos;
    }
    toString() {
        let l1 = this.rhs.slice(0, this.dpos);
        let l2 = this.rhs.slice(this.dpos);
        return this.lhs + "\u2192 " + l1.join(" ") + "\u2022 " + l2.join(" ");
    }
}
exports.LR0Item = LR0Item;
//# sourceMappingURL=LR.js.map