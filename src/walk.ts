import { lstat, readdir } from './async-fs'

import path from 'path'

export type File = { name: string; abspath: string }

export type FolderCollection = {
  files: File[]
  dirs: string[]
}

export async function walk(
  start: string,
  callback: (path: string, coll: FolderCollection) => void
) {
  const stat = await lstat(start)
  if (!stat.isDirectory()) {
    throw new Error('path: ' + start + ' is not a directory')
  }
  const files = await readdir(start)
  const coll: FolderCollection = { files: [], dirs: [] }
  await Promise.all(
    files.map(async name => {
      const abspath = path.join(start, name)
      const abspathStat = await lstat(abspath)
      if (abspathStat.isDirectory()) {
        await walk(abspath, callback)
        coll.dirs.push(abspath)
      } else {
        coll.files.push({ abspath, name })
      }
    })
  )

  callback(start, coll)
}
