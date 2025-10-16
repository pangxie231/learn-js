function clone(obj) {
  const valueType = Object.prototype.toString.call(obj).slice(8, -1)

  // 这个赋值是为了克隆基础类型数据
  let result = obj

  // 克隆Set
  if (valueType === 'Set') {
    return new Set([...obj].map(value => clone(value)))
  }

  // 克隆Map
  if (valueType === 'Map') {
    return new Map([...obj].map(([k, v]) => [clone(k), clone(v)]))
  }

  // 克隆Date
  if (valueType === 'Date') {
    return new Date(obj.getTime())
  }


  // 克隆RegExp
  if (valueType === 'RegExp') {
    return new RegExp(obj.source, getRegFlags(obj))
  }

  // 克隆数组或者对象
  if (valueType === 'Array' || valueType === 'Object') {
    result = Array.isArray(obj) ? [] : {}
    for (let k in obj) {
      result[k] = clone(obj[k])
    }
  }

  return result
}

function getRegFlags(reg) {
  if (reg.flags) {
    return reg.flags
  }

  const flags = []

  reg.indices && flags.push('d')
  reg.global && flags.push('g')
  reg.ignoreCase && flags.push('i')
  reg.multiline && flags.push('m')
  reg.dotAll && flags.push('s')
  reg.unicode && flags.push('u')
  reg.unicodeSets && flags('v')
  reg.sticky && flags.push('y')

  return flags.join('')
}



// var obj = {
//   a: 1,
//   b: 2,
//   c: [
//     3,
//     {
//       d: 4
//     }
//   ]
// }
var obj = {
  // a: new Date()
  // a: new Set([1])
  // a: new Map([
  //   ['a', 1]
  // ])
  a: {
    b: /\wa/,
    c: /\wa/dgimsuy
  }
}
var obj2 = clone(obj)

// number string boolean
// obj 
// arr