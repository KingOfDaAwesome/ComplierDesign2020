"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require("fs");
const shuntingyard_1 = require("./shuntingyard");
let testCount = 0;
function main() {
    let ok = testWithFile("basictests.txt");
    if (ok)
        process.stderr.write("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-Basic tests OK-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n");
    else
        return;
    ok = testWithFile("bonus1tests.txt");
    if (ok)
        process.stderr.write("-=-=-=-=-=-=-=-=-=-=-Bonus 1 tests (1+ argument functions) OK-=-=-=-=-=-=-=-=-=-=-\n");
    else
        return;
    ok = testWithFile("bonus2tests.txt");
    if (ok)
        process.stderr.write("-=-=-=-=-=-=-=-=-=-=-Bonus 2 tests (0+ argument functions) OK-=-=-=-=-=-=-=-=-=-=-\n");
    else
        return;
    process.stderr.write(testCount + " tests OK\n");
}
function testWithFile(fname) {
    let data = fs.readFileSync(fname, "utf8");
    let lst = data.split(/\n/g);
    for (let i = 0; i < lst.length; ++i) {
        let line = lst[i].trim();
        if (line.length === 0)
            continue;
        let idx = line.indexOf("\t");
        let inp = line.substring(0, idx);
        let expectedStr = line.substring(idx);
        console.log("Testing " + inp + " ...");
        ++testCount;
        let expected = JSON.parse(expectedStr);
        let actual = shuntingyard_1.parse(inp);
        if (!treesAreSame(actual, expected)) {
            console.log("BAD!");
            console.log(inp);
            dumpTree("actual.dot", actual);
            dumpTree("expected.dot", expected);
            return false;
        }
        else {
        }
    }
    return true;
}
function treesAreSame(n1, n2) {
    if (n1 === undefined && n2 !== undefined)
        return false;
    if (n2 === undefined && n1 !== undefined)
        return false;
    if (n1["sym"] != n2["sym"])
        return false;
    if (n1["children"].length != n2["children"].length)
        return false;
    for (let i = 0; i < n1["children"].length; ++i) {
        if (!treesAreSame(n1["children"][i], n2["children"][i]))
            return false;
    }
    return true;
}
function dumpTree(fname, root) {
    function walk(n, callback) {
        if (!n)
            return;
        callback(n);
        if (!n.children)
            return;
        n.children.forEach((x) => {
            if (!x)
                return;
            walk(x, callback);
        });
    }
    let L = [];
    L.push("digraph d{");
    L.push(`node [fontname="Helvetica",shape=box];`);
    let counter = 0;
    walk(root, (n) => {
        if (!n)
            return;
        n.NUMBER = "n" + (counter++);
        let tmp = n.sym;
        tmp = tmp.replace(/&/g, "&amp;");
        tmp = tmp.replace(/</g, "&lt;");
        tmp = tmp.replace(/>/g, "&gt;");
        tmp = tmp.replace(/\n/g, "<br/>");
        L.push(`${n.NUMBER} [label=<${tmp}>];`);
    });
    walk(root, (n) => {
        if (!n || !n.children)
            return;
        n.children.forEach((x) => {
            if (!x)
                return;
            L.push(`${n.NUMBER} -> ${x.NUMBER};`);
        });
    });
    L.push("}");
    fs.writeFileSync(fname, L.join("\n"));
}
main();
//# sourceMappingURL=testharness (sy).js.map