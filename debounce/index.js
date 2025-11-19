// 防抖函数

// 基础防抖
// 是否立即执行一次
// cancel 直接调用函数 取消函数
// flush，直接调用函数，立即执行


function debounce(fn, wait, canFirst) {

  const timeout = null
  const debouncedFn = null

  const clear = ()=> {
    
  }
  const flush = ()=> {}

  const wrapFn = function() {}

  wrapFn.cancel = clear
  wrapFn.flush = flush

  return wrapFn

}