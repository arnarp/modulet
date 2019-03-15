"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const generatedClasses = new Set();
function generateClass() {
    const randomHex = crypto_1.default.randomBytes(30).toString('hex');
    const match = /\D.{5}/.exec(randomHex);
    if (match == null) {
        return generateClass();
    }
    const c = match[0];
    if (generatedClasses.has(c)) {
        return generateClass();
    }
    generatedClasses.add(c);
    return c;
}
exports.generateClass = generateClass;
