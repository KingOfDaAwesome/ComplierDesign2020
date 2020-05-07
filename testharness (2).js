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
        let expected = tests[i]["nullable"];
        let input = tests[i]["input"];
        let G = new Grammar_1.Grammar(input);
        let nullable = G.getNullable();
        if (!setsAreSame(nullable, expected)) {
            console.log("Test " + name + " failed");
            ++numFailed;
        }
        else
            ++numPassed;
    }
    console.log(numPassed + " tests OK" + "      " + numFailed + " tests failed");
    return numFailed == 0;
}
function setsAreSame(s1, s2) {
    let L1 = [];
    let L2 = [];
    s1.forEach((x) => {
        L1.push(x);
    });
    s2.forEach((x) => {
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
//# sourceMappingURL=testharness (2).js.map