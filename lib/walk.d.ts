export declare type File = {
    name: string;
    abspath: string;
};
export declare type FolderCollection = {
    files: File[];
    dirs: string[];
};
export declare function walk(start: string, callback: (path: string, coll: FolderCollection) => void): Promise<void>;
