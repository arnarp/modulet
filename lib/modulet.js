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
const walk_1 = require("./walk");
const async_fs_1 = require("./async-fs");
const generate_class_1 = require("./generate-class");
const get_distinct_css_classes_1 = require("./get-distinct-css-classes");
const path_1 = __importDefault(require("path"));
const run_promises_sequentally_1 = require("./run-promises-sequentally");
function modulet(source) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = [];
        const contents = new Map();
        const cssFiles = [];
        yield walk_1.walk(source, (path, coll) => {
            coll.files.forEach(i => files.push(i));
        });
        yield Promise.all(files.map((f) => __awaiter(this, void 0, void 0, function* () {
            const content = yield async_fs_1.readFile(f.abspath);
            contents.set(f.abspath, content.toString());
        })));
        files.forEach(f => {
            if (/.*\.css$/.test(f.name)) {
                cssFiles.push({ css: Object.assign({}, f), reverseDependencies: [] });
            }
        });
        yield Promise.all(files.map((f) => __awaiter(this, void 0, void 0, function* () {
            if (/.*\.js$/.test(f.name)) {
                const code = contents.get(f.abspath);
                if (code == undefined) {
                    return;
                }
                const importRegex = /import\s(\w+)\sfrom\s'(.+\.css)'/gm;
                let match = null;
                const matches = [];
                while ((match = importRegex.exec(code))) {
                    matches.push({
                        match: match[0],
                        var: match[1],
                        path: match[2]
                    });
                }
                matches.forEach(m => {
                    const cssFileAbsPath = path_1.default.join(f.abspath.replace(f.name, m.path));
                    const cssFile = cssFiles.find(i => i.css.abspath == cssFileAbsPath);
                    if (cssFile) {
                        cssFile.reverseDependencies.push({ file: f, match: m });
                    }
                });
            }
        })));
        yield run_promises_sequentally_1.runPromisesSequentally(cssFiles.map((f) => __awaiter(this, void 0, void 0, function* () {
            let code = contents.get(f.css.abspath) || '';
            const classes = Array.from(get_distinct_css_classes_1.getDistinctCssClasses(code)).map(i => {
                return {
                    class: i,
                    id: generate_class_1.generateClass()
                };
            });
            classes.forEach(c => {
                code = code.replace(new RegExp(`\\.${c.class}`, 'g'), `.${c.id}`);
            });
            contents.set(f.css.abspath, code);
            yield run_promises_sequentally_1.runPromisesSequentally(f.reverseDependencies.map((d) => __awaiter(this, void 0, void 0, function* () {
                let dCode = contents.get(d.file.abspath) || '';
                const replacement = `import '${d.match.path}'\nconst ${d.match.var} = { ${classes.map(k => `${k.class}: '${k.id}'`).join(', ')} }`;
                dCode = dCode.replace(d.match.match, replacement);
                contents.set(d.file.abspath, dCode);
            })));
        })));
        yield Promise.all(Array.from(contents.entries()).map((c) => __awaiter(this, void 0, void 0, function* () {
            yield async_fs_1.writeFile(c[0], c[1]);
        })));
    });
}
exports.modulet = modulet;
