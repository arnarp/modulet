#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const modulet_1 = require("./modulet");
const commander_1 = __importDefault(require("commander"));
const clear = require('clear');
clear();
console.log(chalk_1.default.red(figlet_1.default.textSync('modulet', { horizontalLayout: 'full' })));
let source = '.';
commander_1.default
    .version('0.1.0')
    .arguments('<source>')
    .action(function (s) {
    source = s;
});
commander_1.default.parse(process.argv);
modulet_1.modulet(source);
