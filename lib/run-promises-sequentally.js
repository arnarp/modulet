"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function runPromisesSequentally(promises) {
    promises.reduce((promiseChain, currentTask) => {
        return promiseChain.then(chainResults => currentTask.then(currentResult => [...chainResults, currentResult]));
    }, Promise.resolve([]));
}
exports.runPromisesSequentally = runPromisesSequentally;
