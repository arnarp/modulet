"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function lstat(path) {
    return new Promise((resolve, reject) => {
        fs_1.default.lstat(path, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}
exports.lstat = lstat;
function readdir(path) {
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(path, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        });
    });
}
exports.readdir = readdir;
function readFile(path) {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(path, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}
exports.readFile = readFile;
function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs_1.default.writeFile(path, data, err => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}
exports.writeFile = writeFile;
