"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cssClassRegex = /\.([A-Za-z]\w*)/g;
function getDistinctCssClasses(code) {
    const set = new Set();
    let match = null;
    while ((match = cssClassRegex.exec(code))) {
        set.add(match[1]);
    }
    return set;
}
exports.getDistinctCssClasses = getDistinctCssClasses;
