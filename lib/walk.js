"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_fs_1 = require("./async-fs");
const path_1 = __importDefault(require("path"));
function walk(start, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const stat = yield async_fs_1.lstat(start);
        if (!stat.isDirectory()) {
            throw new Error('path: ' + start + ' is not a directory');
        }
        const files = yield async_fs_1.readdir(start);
        const coll = { files: [], dirs: [] };
        yield Promise.all(files.map((name) => __awaiter(this, void 0, void 0, function* () {
            const abspath = path_1.default.join(start, name);
            const abspathStat = yield async_fs_1.lstat(abspath);
            if (abspathStat.isDirectory()) {
                yield walk(abspath, callback);
                coll.dirs.push(abspath);
            }
            else {
                coll.files.push({ abspath, name });
            }
        })));
        callback(start, coll);
    });
}
exports.walk = walk;
