/*
  var obj = {a: 3, b: 5, c: 9};
  pick(obj, ['a', 'c']); // {a: 3, c: 9}
  pick(obj, 'a', 'c'); // {a: 3, c: 9}
  pick(obj, ['a', 'b', 'd']); // {a: 3, b: 5}
  pick(obj, ['a', 'a']); // {a: 3}
*/

// 接收两个参数
// obj array|...arr
// 不存在的key，不会报错
// 多个key，只存在一个

// function pick(obj, arr) {
//   if (obj == null) return {}


//   const keys = Array.isArray(arr) ? arr : [...arguments]

//   if (keys.length === 0) return {}

//   const result = {}

//   keys.forEach(k => {
//     if (obj[k]) {
//       result[k] = obj[k]
//     }
//   })

//   console.log("🚀 ~ pick ~ result:", result)
//   return result
// }

// function pick(obj, select) {
//   const result = {}

//   if(typeof select === 'string') {
//     select = [...arguments]
//   }

//   if(select == null || obj == null) return result

//   const len = select.length
//   for(let i = 0; i < len; i ++) {
//     const key = select[i]
//     if(key in obj) {
//       result[key] = obj[key]
//     }
//   }

//   return result
// }

function pick(obj, value) {
  if (obj == null) return {}
  if (value == null || value.length === 0) return {}

  if (typeof value === 'string') {
    value = [...arguments]
  }

  const result = {}

  const len = value.length
  for (let i = 0; i < len; i++) {
    const key = value[i]
    if (key in obj) {
      result[key] = obj[key]
    }
  }

  console.log("🚀 ~ pick ~ result:", result)
  return result
}

var obj = {
  a: 3,
  b: 5,
  c: 9
};
// pick(obj, ['a', 'c']); // {a: 3, c: 9}
// pick(obj, 'a', 'c'); // {a: 3, c: 9}
// pick(obj, ['a', 'b', 'd']); // {a: 3, b: 5}
pick(obj, ['a', 'a']); // {a: 3}

// pick(null, [])
// pick(undefined, [])
// var a = pick(obj, null)
// pick(obj, true)