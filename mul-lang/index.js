import { readFileSync, writeFileSync } from 'fs'
import langs from './lang.js'
import { glob } from 'glob'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const zhLang = langs['zh']

// 文件读取可传入glob
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取文件
async function readAssets(rule) {
  const files = await glob(rule, { ignore: 'node_modules/**' })

  // 双斜杠注释
  const doubleSlash = /^\/\/.*?$/
  // html注释
  const htmlNotes = /^\s*<!--.*?-->.*?$/
  
  
  for (const file of files) {
    let data = readFileSync(path.join(__dirname, file), {
      encoding: 'utf-8'
    })
    
    Object.entries(zhLang).forEach(([k, v]) => {
      // ^[\s]*(<\w>)?攻略.*?$
      // const baseReg = new RegExp(`^.*?${v}.*?$`, 'gm')
      // v2版本
      const baseReg = new RegExp(`^( )*(<\\w.*?>)?${v}.*?$`, 'gm')
      
      // 已经是多语言写法
      const alreadyT = new RegExp(`^.*?\\$?t\\(('|")${v}('|")\\).*?$`)

      // console.log('🚀 ~ readAssets ~ baseReg:', baseReg)


      // 匹配到的所有行
      const lines = data.match(baseReg)



      if (!lines) {
        return
      }
      // console.log('🚀 ~ readAssets ~ lines:', lines)

      // debugger
      // 去掉注释的行
      const filterLines = lines.filter(line => {
        return !(doubleSlash.test(line) || htmlNotes.test(line) || (alreadyT.test(line)))
      })

      console.log('🚀 ~ readAssets ~ filterLines:', filterLines)




      let ret = ''
      const replaceLines = filterLines.forEach(line => {
        const attrReg = new RegExp(`^.*?(\\w+)="(${v})".*?$`)

        const tempReg = new RegExp(`^[^'\\n]*(${v})[^'\\n]*$`)

        // 属性
        if (attrReg.test(line)) {
          const matches = line.match(attrReg)

          // console.log('🚀 ~ readAssets ~ matches:', matches)

          // line.
          // matches[0]
          // debugger
          ret = line.replace(matches[1], ':$&').replace(matches[2], `$t('${k}')`)

          // template下的直接字符串
        } else if(tempReg.test(line)) {
          const matches =  line.match(tempReg)
          ret = line.replace(matches[1], `{{ $t(${k}) }}`)

        } else {
          // 直接替换
          ret = line.replace(new RegExp(`('|")${v}('|")`), `t('${k}')`)

        }


        data = data.replace(line, ret)
        // console.log('data', data)
      })
    })

    // 正常
    // 带属性
    // 有注释就忽略


    writeFileSync(path.join(__dirname, file), data , {
      encoding: 'utf-8'
    })
  }

}

readAssets('./*.vue')