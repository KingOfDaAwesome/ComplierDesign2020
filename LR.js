"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("./Grammar");
var gram;
function makeNFA(string) {
    gram = new Grammar_1.Grammar(string);
    gram.findGrammar();
    console.log(gram.nonterm);
    let startsymbol = gram.startSymbol;
    console.log(startsymbol);
    let startState = new State(new LR0Item("S'", [startsymbol], 0));
    let allState = [];
    let StateMap = new Map();
    allState.push(startState);
    let todo = [0];
    while (todo.length > 0) {
        let qi = todo.pop();
        let q = allState[qi];
        makeTransitions(q, allState, todo, StateMap);
    }
    return allState;
}
exports.makeNFA = makeNFA;
function makeTransitions(q, allstate, toDo, stateMap) {
    if (q.item.dpos == q.item.rhs.length) {
        return;
    }
    let sym = q.item.rhs[q.item.dpos];
    console.log(q.item.rhs);
    let I2 = new LR0Item(q.item.lhs, q.item.rhs, q.item.dpos + 1);
    console.log("shuffledpos");
    console.log(I2.toString());
    let q2i = getStateWithLabel(I2, allstate, toDo, stateMap);
    q.addTransition(sym, q2i);
    if (gram.nonterm.has(sym)) {
        for (let P of gram.nonterm.get(sym).split(" | ")) {
            console.log(P);
            I2 = new LR0Item(sym, P.replace("lamdba", "").split(" "), 0);
            console.log("newOneBasedOnProductions");
            console.log(I2.toString());
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
        allstates.push(new State(I2));
        toDo.push(q2i);
        stateMap.set(I2s, q2i);
    }
    return q2i;
}
exports.getStateWithLabel = getStateWithLabel;
class State {
    constructor(lr0item) {
        this.item = lr0item;
        this.transitions = new Map();
    }
    addTransition(sym, stateIndex) {
        if (!this.transitions.has(sym))
            this.transitions.set(sym, []);
        this.transitions.get(sym).push(stateIndex);
    }
}
exports.State = State;
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