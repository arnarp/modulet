/// <reference types="node" />
import fs from 'fs';
export declare function lstat(path: string): Promise<fs.Stats>;
export declare function readdir(path: string): Promise<string[]>;
export declare function readFile(path: string): Promise<Buffer>;
export declare function writeFile(path: string, data: string): Promise<void>;
