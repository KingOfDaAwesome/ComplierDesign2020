"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require("fs");
const Grammar_1 = require("./Grammar");
function main() {
    let data = fs.readFileSync("tests.txt", "utf8");
    let tests = JSON.parse(data);
    let numPassed = 0;
    let numFailed = 0;
    for (let i = 0; i < tests.length; ++i) {
        let name = tests[i]["name"];
        let expected = tests[i]["first"];
        let input = tests[i]["input"];
        let G = new Grammar_1.Grammar(input);
        let first = G.getFirst();
        if (!dictionariesAreSame(expected, first)) {
            console.log("Test " + name + " failed");
            ++numFailed;
        }
        else
            ++numPassed;
    }
    console.log(numPassed + " tests OK" + "      " + numFailed + " tests failed");
    return numFailed == 0;
}
function dictionariesAreSame(s1, s2) {
    let M1 = toMap(s1);
    let M2 = s2;
    let k1 = [];
    let k2 = [];
    for (let k of M1.keys())
        k1.push(k);
    for (let k of M2.keys())
        k2.push(k);
    k1.sort();
    k2.sort();
    if (!listsEqual(k1, k2)) {
        console.log("Lists not equal:", k1, k2);
        return false;
    }
    for (let k of k1) {
        if (!listsEqual(M1.get(k), M2.get(k))) {
            console.log("Lists not equal:", M1.get(k), M2.get(k));
            return false;
        }
    }
    return true;
}
function toMap(s) {
    let r = new Map();
    for (let k in s) {
        r.set(k, new Set());
        s[k].forEach((x) => {
            r.get(k).add(x);
        });
    }
    return r;
}
function listsEqual(L1a, L2a) {
    let L1 = [];
    let L2 = [];
    L1a.forEach((x) => {
        L1.push(x);
    });
    L2a.forEach((x) => {
        L2.push(x);
    });
    L1.sort();
    L2.sort();
    if (L1.length !== L2.length)
        return false;
    for (let i = 0; i < L1.length; ++i) {
        if (L1[i] !== L2[i])
            return false;
    }
    return true;
}
main();
//# sourceMappingURL=app.js.map