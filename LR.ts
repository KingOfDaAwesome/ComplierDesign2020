import { treeNode } from "./shuntingyard"
import { Grammar } from "./Grammar"
import { Tokenizer } from "./Tokenizer"

var gram: Grammar

export function makeNFA(string): State[] {
    gram = new Grammar(string);
    gram.findGrammar()
    console.log(gram.nonterm)
    let startsymbol = gram.startSymbol
    console.log(startsymbol)
    let startState = new State(new LR0Item("S'",[startsymbol],0));
    let allState: State[] = []
    let StateMap = new Map<string,number>()
    allState.push(startState)

    let todo: number[] = [0];
    while (todo.length > 0) {
        let qi = todo.pop();
        let q = allState[qi];
        makeTransitions(q, allState, todo,StateMap);
    }
    return allState
}

export function makeTransitions(q: State,allstate:State[],toDo:number[],stateMap: Map<string,number>) {
    if (q.item.dpos == q.item.rhs.length) {
        return
    }
    let sym = q.item.rhs[q.item.dpos]
    console.log(q.item.rhs)
    let I2 = new LR0Item(q.item.lhs, q.item.rhs, q.item.dpos + 1)
    console.log("shuffledpos")
    console.log(I2.toString())
    let q2i = getStateWithLabel(I2, allstate, toDo, stateMap);
    q.addTransition(sym, q2i)
    if (gram.nonterm.has(sym)) {
        for (let P of gram.nonterm.get(sym).split(" | ") ){
            console.log(P)
            I2 = new LR0Item(sym, P.replace("lamdba","").split(" "), 0);
            console.log("newOneBasedOnProductions")
            console.log(I2.toString())
            let q2i = getStateWithLabel(I2, allstate, toDo, stateMap);
            q.addTransition("",q2i)
        }
    }
    


}
export function getStateWithLabel(I2: LR0Item, allstates: State[], toDo: number[], stateMap: Map<string, number>) {
    let I2s = I2.toString()
    let q2i: number;
    if (stateMap.has(I2s)) {
        q2i = stateMap.get(I2s)
    }
    else {
        q2i = allstates.length;
        allstates.push(new State(I2))
        toDo.push(q2i)
        stateMap.set(I2s,q2i)
    }
    return q2i;
}

export class State {
    item: LR0Item;
    transitions: Map<string,number[]>

    constructor(lr0item:LR0Item) {
        this.item = lr0item;
        this.transitions = new Map();
    }
    addTransition(sym: string, stateIndex: number) {
        if (!this.transitions.has(sym))
            this.transitions.set(sym, [])
        this.transitions.get(sym).push(stateIndex)
    }
}
export class LR0Item {
    lhs: string
    rhs: string[]
    dpos: number;

    constructor(lhs: string, rhs: string[],dpos:number) {
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