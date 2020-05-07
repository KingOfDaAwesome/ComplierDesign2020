import { treeNode } from "./shuntingyard"
import { Grammar } from "./Grammar"
import { Tokenizer } from "./Tokenizer"

var gram: Grammar
var StateMap: Map<string, number>
var DFaMap: Map<string, number>

export function makeNFA(string): NFAState[] {
    gram = new Grammar(string);
    gram.findGrammar()
    console.log(gram.nonterm)
    let startsymbol = gram.startSymbol
    console.log(startsymbol)
    let startState = new NFAState(new LR0Item("S'", [startsymbol], 0));
    let allState: NFAState[] = []
    allState.push(startState)
    StateMap = new Map()
    DFaMap = new Map()
    let todo: number[] = [0];
    while (todo.length > 0) {
        let qi = todo.pop();
        let q = allState[qi];
        makeTransitions(q, allState, todo, StateMap);
    }
    return allState
}
export function makeDFA(string): DFAState[] {
    let nfa = makeNFA(string)
    for (let ns = 0; ns < nfa.length; ns++) {
        //console.log(nfa[ns])
        //console.log(ns)
        //console.log(nfa[ns].closure)
        computeClosure(nfa,ns,nfa[ns].closure)
    }
    //computeClosure(nfa,0,nfa[0].closure)
    let startsymbol = gram.startSymbol
    //let startState = new DFAState(new LR0Item("S'", [startsymbol], 0));
    let dfa: DFAState[] = []
    let StateMap = new Map<string, number>()
    dfa.push(new DFAState(nfa[0].closure));
    let toDo: number[] = [0]

    while (toDo.length > 0) {
        console.log("hi")
        let qi = toDo.pop();
        let q = dfa[qi];
        processState(q,nfa,dfa,toDo)
    }
    return dfa
}
export function processState(q: DFAState, nfa: NFAState[], dfa: DFAState[], toDo: number[]) {
    //console.log("here")
    console.log(q)
    console.log(nfa)
    console.log(dfa)
    console.log(toDo)
    let r = collectTransitions(q,nfa)
    console.log(r)
    for (let l of r) {
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
        console.log(l)
        let f = getDfaStateWithLabel(l[1], dfa, toDo)
        q.addTransition(l[0],f)
    }
}
export function collectTransitions(q: DFAState, nfa: NFAState[]) {
    let r: Map<string, Set<number>> = new Map();
    q.label.forEach((nfaStateIndex: number) => {
        let nq = nfa[nfaStateIndex];
        for (let sym of nq.transitions.keys()) {
            if (sym != "" && sym != "lambda") {
                if (!r.has(sym))
                    r.set(sym, new Set())
                nq.transitions.get(sym).forEach((x: number) => {
                    let nq2 = nfa[x];
                    r.set(sym, union(r.get(sym), nq2.closure))
                });
            }
        }
    });
    return r;
}
export function getDfaStateWithLabel(q: Set<number>,dfa:DFAState[],toDo: number[]) {
    let r2s = setToString(q);
    let z: number;
    if (DFaMap.has(r2s)) {
        z = DFaMap.get(r2s)
    }
    else {
        z = dfa.length;
        dfa.push(new DFAState(q))
        toDo.push(z)
        DFaMap.set(r2s,z)
    }
    return z;
}
export function union(set1: Set<number>, set2: Set<number>) {
    for (let x of set2)
        set1.add(x)
    return set1
}
export function computeClosure(nfa: NFAState[], stateIndex: number, closure: Set<number>) {
    closure.add(stateIndex);
    if (nfa[stateIndex].transitions.has("")) {
        nfa[stateIndex].transitions.get("").forEach((index: number) => {
            if (!closure.has(index)) {
                computeClosure(nfa, index, closure);

            }
        });
    }
    //console.log(closure)
}
export function makeTransitions(q: NFAState, allstate: NFAState[], toDo: number[], stateMap: Map<string, number>) {
    if (q.item.dpos == q.item.rhs.length) {
        return
    }
    let sym = q.item.rhs[q.item.dpos]
    //console.log(q.item.rhs)
    let I2 = new LR0Item(q.item.lhs, q.item.rhs, q.item.dpos + 1)
    //console.log("shuffledpos")
    //console.log(I2.toString())
    let q2i = getStateWithLabel(I2, allstate, toDo, stateMap);
    q.addTransition(sym, q2i)
    if (gram.nonterm.has(sym)) {
        for (let P of gram.nonterm.get(sym).split(" | ")) {
            //console.log(P)
            I2 = new LR0Item(sym, P.replace("lamdba", "").split(" "), 0);
            //console.log("newOneBasedOnProductions")
            //console.log(I2.toString())
            let q2i = getStateWithLabel(I2, allstate, toDo, stateMap);
            q.addTransition("", q2i)
        }
    }



}
export function getStateWithLabel(I2: LR0Item, allstates: NFAState[], toDo: number[], stateMap: Map<string, number>) {
    let I2s = I2.toString()
    let q2i: number;
    if (stateMap.has(I2s)) {
        q2i = stateMap.get(I2s)
    }
    else {
        q2i = allstates.length;
        allstates.push(new NFAState(I2))
        toDo.push(q2i)
        stateMap.set(I2s, q2i)
    }
    return q2i;
}
export function setToString(s: Set<number>) {
    let L: string[] = [];
    s.forEach((x: number) => {
        L.push(x.toString());
    });
    L.sort();
    return L.join(" ");
}
export class NFAState {
    item: LR0Item;
    transitions: Map<string, number[]>
    closure: Set<number>

    constructor(lr0item: LR0Item) {
        this.item = lr0item;
        this.transitions = new Map();
        this.closure = new Set();
    }
    addTransition(sym: string, stateIndex: number) {
        if (!this.transitions.has(sym))
            this.transitions.set(sym, [])
        this.transitions.get(sym).push(stateIndex)
    }
}
export class DFAState {
    label: Set<number>;
    transitions: Map<string, number>

    constructor(label: Set<number>) {
        this.label = label;
        this.transitions = new Map();
    }
    addTransition(sym: string, stateIndex: number) {
        if (this.transitions.has(sym))
            throw new Error("Duplicate transition");

        this.transitions.set(sym, stateIndex)
    }
}
export class LR0Item {
    lhs: string
    rhs: string[]
    dpos: number;

    constructor(lhs: string, rhs: string[], dpos: number) {
        this.lhs = lhs
        this.rhs = rhs
        this.dpos = dpos
    }
    toString(): string {
        let l1 = this.rhs.slice(0, this.dpos);
        let l2 = this.rhs.slice(this.dpos);
        return this.lhs + "\u2192 " + l1.join(" ") + "\u2022 " + l2.join(" ");
    }
}