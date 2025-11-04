// 将lang.js中的数组项，如果只有一项，就去掉数组
// 写入format-lang.js

import langs from './lang.js'
import { writeFileSync } from 'fs'


const langs2 = Object.entries(langs).reduce((ret, [k,v])=> {
  ret[k] = Object.keys(v).reduce((ret2, k2)=> {

    const curVal = v[k2]
    // ret2[k2] = Array.isArray(curVal) && curVal.length === 1 ? curVal[0] : curVal

    ret2[k2] = Array.isArray(curVal) ? curVal.join('') : curVal

    return ret2
  }, {})

  return ret
}, {})

writeFileSync('format-lang.js', 'export default' + JSON.stringify(langs2), {
  encoding: 'utf-8'
})