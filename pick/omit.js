
function omit(obj, value) {
  // obj为null或者undefined
  // 返回空对象
  // value为null或者undefeind, value的length为0
  // 返回obj或者空对象

  if(obj == null) return {}

  if(value == null) return obj || {}

  if(typeof value === 'string') {
    value = [...arguments]
  }

  if(value.length === 0) return obj || {}

  const result = {}
  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {
      if(value.indexOf(key) === -1) {
        result[key] = obj[key]
      }
    }
  }

  console.log("🚀 ~ omit ~ result:", result)
  return result
}

var obj = {
  a: 3,
  b: 5,
  c: 9
};

// omit(obj, ['a'])
omit(obj, 'a', 'b')
// omit(null, [])
// omit(undefined, [])
// omit(obj, [])
// omit(obj, null)
// omit(obj, undefined)