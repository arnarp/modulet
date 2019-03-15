import fs from 'fs'

export function lstat(path: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.lstat(path, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

export function readdir(path: string) {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        return reject(err)
      }
      return resolve(files)
    })
  })
}

export function readFile(path: string) {
  return new Promise<Buffer>((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

export function writeFile(path: string, data: string) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, data, err => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}
