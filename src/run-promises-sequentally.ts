export function runPromisesSequentally<T>(promises: Promise<T>[]) {
  promises.reduce<Promise<T[]>>((promiseChain, currentTask) => {
    return promiseChain.then(chainResults =>
      currentTask.then(currentResult => [...chainResults, currentResult])
    )
  }, Promise.resolve([]))
}
