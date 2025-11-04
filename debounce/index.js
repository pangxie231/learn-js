// 防抖函数

// 基础防抖
// 是否立即执行一次
// cancel 直接调用函数 取消函数
// flush，直接调用函数，立即执行


function debounce(fn, wait, canFirst) {
  let timeout = null
  let debouncedFn = null

  const clear = function () {
    clearTimeout(timeout)
    timeout = null
    debouncedFn = null
  }

  const flush = function () {
    clear()
    debouncedFn()
  }

  const debounceWrapper = function (...args) {
    const context = this

    if (canFirst) {
      fn.call(context, ...args)
      canFirst = false
      return
    }

    clear()

    debouncedFn = function () {
      fn.call(context, ...args)
    }

    timeout = setTimeout(() => {
      debouncedFn()
    }, wait);

  }

  debounceWrapper.cancel = clear
  debounceWrapper.flush = flush

  return debounceWrapper
}

const fn = debounce(function (a) {
  console.log('debounce', a)
}, 500)

fn('lh')
fn('dg')
fn('jg')
fn.flush()
// fn.cancel()