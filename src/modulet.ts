import { File, walk } from './walk'
import { readFile, writeFile } from './async-fs'

import { generateClass } from './generate-class'
import { getDistinctCssClasses } from './get-distinct-css-classes'
import path from 'path'
import { runPromisesSequentally } from './run-promises-sequentally'

type Match = {
  match: string
  var: string
  path: string
}

type AbsPath = string

export async function modulet(source: string) {
  const files: File[] = []
  const contents: Map<AbsPath, string> = new Map()
  const cssFiles: {
    css: File
    reverseDependencies: { file: File; match: Match }[]
  }[] = []
  await walk(source, (path, coll) => {
    coll.files.forEach(i => files.push(i))
  })

  await Promise.all(
    files.map(async f => {
      const content = await readFile(f.abspath)
      contents.set(f.abspath, content.toString())
    })
  )

  files.forEach(f => {
    if (/.*\.css$/.test(f.name)) {
      cssFiles.push({ css: { ...f }, reverseDependencies: [] })
    }
  })
  await Promise.all(
    files.map(async f => {
      if (/.*\.js$/.test(f.name)) {
        const code = contents.get(f.abspath)
        if (code == undefined) {
          return
        }
        const matches: Match[] = []
        let match: RegExpExecArray | null = null
        const importRegex = /import\s(\w+)\sfrom\s'(.+\.css)'/gm
        while ((match = importRegex.exec(code))) {
          matches.push({
            match: match[0],
            var: match[1],
            path: match[2]
          })
        }
        const requireRegex = /var\s(\w+)\s=\srequire\('(.+\.css)'\)/gm
        while ((match = requireRegex.exec(code))) {
          matches.push({
            match: match[0],
            var: match[1],
            path: match[2]
          })
        }
        matches.forEach(m => {
          const cssFileAbsPath = path.join(f.abspath.replace(f.name, m.path))
          const cssFile = cssFiles.find(i => i.css.abspath == cssFileAbsPath)
          if (cssFile) {
            cssFile.reverseDependencies.push({ file: f, match: m })
          }
        })
      }
    })
  )
  await runPromisesSequentally(
    cssFiles.map(async f => {
      let code = contents.get(f.css.abspath) || ''
      const classes = Array.from(getDistinctCssClasses(code)).map(i => {
        return {
          class: i,
          id: generateClass()
        }
      })
      classes.forEach(c => {
        code = code.replace(new RegExp(`\\.${c.class}`, 'g'), `.${c.id}`)
      })
      contents.set(f.css.abspath, code)
      await runPromisesSequentally(
        f.reverseDependencies.map(async d => {
          let dCode = contents.get(d.file.abspath) || ''
          const replacement = `import '${d.match.path}'\nconst ${
            d.match.var
          } = { ${classes.map(k => `${k.class}: '${k.id}'`).join(', ')} }`
          dCode = dCode.replace(d.match.match, replacement)
          contents.set(d.file.abspath, dCode)
        })
      )
    })
  )
  await Promise.all(
    Array.from(contents.entries()).map(async c => {
      await writeFile(c[0], c[1])
    })
  )
}
