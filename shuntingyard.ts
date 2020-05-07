import { Token } from "./Token"
import { Grammar } from "./Grammar"
import { Tokenizer } from "./Tokenizer"

export function parse(string): treeNode {
    let str = string;
    let gram = new Grammar(
        "BITNOT -> [~]\nNEGATE -> [-]\nPOWOP -> [*][*]\nLP -> [(]\nRP -> [)]\nNUM -> \\d+\nADDOP -> [+]\nMULOP -> [*]\nDIVOP -> [/]\nSUBOP -> [-]\n\nexp -> NUM ADDOP exp | NUM | NUM SUBOP exp | NUM MULOP exp | NUM DIVOP exp | LP exp RP| NUM POWOP exp| NEGATE exp| BITNOT exp");
    //console.log(gram);
    let tok = new Tokenizer(gram);
    let prior = new Map<String,number>();
    prior.set("POWOP", 4);
    prior.set("NEGATE", 4);
    prior.set("BITNOT", 4);
    prior.set("MULOP", 2);
    prior.set("ADDOP", 1);
    prior.set("DIVOP", 2);
    prior.set("SUBOP", 1);
    let assoc = new Map<String, number>();
    assoc.set("POWOP", 1);
    assoc.set("NEGATE", 1);
    assoc.set("BITNOT", 1);
    assoc.set("MULOP", 0);
    assoc.set("ADDOP", 0);
    assoc.set("DIVOP", 0);
    assoc.set("SUBOP", 0);
    let opNUM = new Map<String, number>();
    opNUM.set("POWOP", 2);
    opNUM.set("NEGATE", 1);
    opNUM.set("BITNOT", 1);
    opNUM.set("MULOP", 2);
    opNUM.set("ADDOP", 2);
    opNUM.set("DIVOP", 2);
    opNUM.set("SUBOP", 2);
    //prior.set("NUM", 0);
    //prior.set("ID", 0);
    tok.setInput(string);
    tok.walk();
    console.log(tok.tokens)
    let nodes = new Array <treeNode>()
    for (let baseNode of tok.tokens) {
        if (baseNode[1].lexeme == ("-")) {
            if (baseNode[0] == 1)
                baseNode[1].sym = "NEGATE"
            else if (nodes[nodes.length - 1].sym == "RP" || nodes[nodes.length - 1].sym == "ID" || nodes[nodes.length - 1].sym == "NUM")
                baseNode[1].sym = "SUBOP"
            else
                baseNode[1].sym = "NEGATE"
        }
        let childs = new Array<treeNode>()
        let newNode = new treeNode(childs, baseNode[1].sym, baseNode[1]);
        nodes.push(newNode)
    }
    nodes.pop()
    //console.log(nodes)
    let done = false;
    let operandStack = new Array<treeNode>();
    let operStack = new Array<treeNode>();
    let lastop;
    for (let i = 0; i < nodes.length; ++i) {
        console.log("\n\n\noperandStack")
        console.log(operandStack)
        console.log("opStack")
        console.log(operStack)
        //console.log("\n\n\nsym\n")
        //console.log(nodes[i])
        //console.log(nodes[i].sym)
        if (nodes[i].sym == "NUM" || nodes[i].sym == "ID")
            operandStack.push(nodes[i])
        else if (nodes[i].sym == "RP") {
             //console.log("hellllllllllllo")
             while (true) {
                console.log("******************************************************************")
                 let op = operStack.pop()

                console.log(op)
                if (op.sym != "LP") {
                    let c1 = operandStack.pop()
                    let c0 = operandStack.pop()
                    if (op.sym == "SUBOP")
                        op.sym = "ADDOP"
                    if (op.sym == "DIVOP")
                        op.sym = "MULOP"
                    op.children.push(c0)
                    console.log("children")
                    console.log(c0)
                    console.log(c1)
                    op.children.push(c1)
                    operandStack.push(op)
                    console.log("\n\n\n\n\nyoda3")
                    console.log(operStack)
                }
                else
                    break
            }
        }
        //else if (nodes[i].sym == "BITNOT" || nodes[i].sym == "NEGATE")
        //{

        //}
        else {
            while (true) {
                //console.log("hello")
                if (operStack.length == 0) { 
                    //console.log("hello2")
                    break
                }
                let p = operStack[operStack.length - 1].sym
                //console.log("ggggggggggggggggggggggggggggggggggggggggg")
                //console.log("p")
                //console.log(p)
                //console.log("prior vs cur prior")
                //console.log(prior.get(p))
                //console.log(prior.get(nodes[i].sym))
                //console.log("1")
                //console.log(operStack)
                if (prior.get(p) >= prior.get(nodes[i].sym) && assoc.get(nodes[i].sym) == 0) {
                    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                    //console.log(nodes[i].sym)
                    //console.log("2")
                    //console.log(opNUM.get(nodes[i].sym))
                    let op = operStack.pop()
                    if (opNUM.get(op.sym) == 1) {
                        let c1 = operandStack.pop()
                        if (op.sym == "SUBOP")
                            op.sym = "ADDOP"
                        if (op.sym == "DIVOP")
                            op.sym = "MULOP"
                        op.children.push(c1)
                        operandStack.push(op)
                        //console.log("nugget")
                        //console.log(op)
                    }
                    else { 
                        let c1 = operandStack.pop()
                        let c0 = operandStack.pop()
                        if (op.sym == "SUBOP")
                            op.sym = "ADDOP"
                        if (op.sym == "DIVOP")
                            op.sym = "MULOP"
                        op.children.push(c0)
                        op.children.push(c1)
                        operandStack.push(op)
                        //console.log("rover")
                        //console.log(op)
                    }
                }
                else if (prior.get(p) > prior.get(nodes[i].sym) && assoc.get(nodes[i].sym) == 1) {
                    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                    //console.log(nodes[i].sym)
                    //console.log("3")
                    let op = operStack.pop()
                    if (opNUM.get(op.sym) == 1) {
                        let c1 = operandStack.pop()
                        if (op.sym == "SUBOP")
                            op.sym = "ADDOP"
                        if (op.sym == "DIVOP")
                            op.sym = "MULOP"
                        op.children.push(c1)
                        operandStack.push(op)
                        //console.log("purple")
                       // console.log(op)
                    }
                    else {
                        let c1 = operandStack.pop()
                        let c0 = operandStack.pop()
                        if (op.sym == "SUBOP")
                            op.sym = "ADDOP"
                        if (op.sym == "DIVOP")
                            op.sym = "MULOP"
                        op.children.push(c0)
                        op.children.push(c1)
                        operandStack.push(op)
                        //console.log("red")
                        //console.log(op)
                    }
                }
                else
                    break
            }
            operStack.push(nodes[i])
        }
        console.log("\n\n\n\n\nyoda2")
        console.log(operStack)
    }
    console.log("\n\n\n\n\nyoda")
    console.log(operStack)
    while (operStack.length > 0) {
        console.log("yo")
        let op = operStack.pop()
        //console.log("4")
        //console.log(opNUM.get(op.sym))
        if (opNUM.get(op.sym) == 2) {
            //console.log("dasijhn")
            let c1 = operandStack.pop()
            let c0 = operandStack.pop()
            if (op.sym == "SUBOP")
                op.sym = "ADDOP"
            if (op.sym == "DIVOP")
                op.sym = "MULOP"
            op.children.push(c0)
            op.children.push(c1)
            operandStack.push(op)
            console.log("blue")
            console.log(op)
        }
        else {
            let c1 = operandStack.pop()
            if (op.sym == "SUBOP")
                op.sym = "ADDOP"
            if (op.sym == "DIVOP")
                op.sym = "MULOP"
            op.children.push(c1)
            operandStack.push(op)
            //console.log("green")
            //console.log(op)
        }
        
        lastop = op
    }
    console.log("lastop")
    console.log(lastop)
    console.log("nodes")
    console.log(nodes)
    return lastop
}

export class treeNode {
    children : Array <treeNode>
    sym: string
    token: Token

    constructor(childs, sym, token?: Token) {
        //for (let c of childs)
        this.children = childs
        this.sym = sym
        this.token = token
    }
}
