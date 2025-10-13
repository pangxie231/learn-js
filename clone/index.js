function clone(obj) {
  const valueType = Object.prototype.toString.call(obj).slice(8, -1)

  let result = obj

  if (valueType === 'Array' || valueType === 'Object') {
    result = Array.isArray(obj) ? [] : {}
    for (let k in obj) {
      result[k] = clone(obj[k])
    }
  }

  return result
}

var obj = {
  a: 1,
  b: 2,
  c: [
    3,
    {
      d: 4
    }
  ]
}
var obj2 = clone(obj)

// number string boolean
// obj 
// arr