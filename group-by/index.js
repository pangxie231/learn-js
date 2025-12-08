// 传入一个数组 一个函数
// 对这个数组进行分组(k: []), k是数组的每一项作为参数传入函数，函数的返回值决定的
function groupBy(arr, func) {
  if ((arr == null) || (arr.length === 0)) return {}

  const result = {}

  for (let i = 0; i < arr.length; i++) {
    const currentItem = arr[i]
    const currentKey = func(currentItem)
    const bucket = result[currentKey]

    if(!Array.isArray(bucket)) {
      result[currentKey] = []
    }

    result[currentKey].push(currentItem)

  }

  console.log("🚀 ~ groupBy ~ result:", result)
  return result
}

// groupBy([6.1, 4.2, 6.3], Math.floor); 
groupBy([1,2,3,4,5,6,7,8], function(i) { return i % 2});
// groupBy({}, Math.floor)