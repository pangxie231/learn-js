// 防抖函数
// 这个函数有什么功能
// 参数 fn wait callFist
// 返回 一个函数
// 通过返回函数调用flush 提前结束定时器
// 通过返回函数调用clear,清除定时器

function debounce(fn, wait, callFirst) {
  let timeout = null
  let debouncedFn = null

  // flush需要调用
  // 1.清除定时器
  // 2.直接调用debounce函数,并且需要重置该函数
  // 

  // 重新开始定时任务前需要调用
  // 1.清除定时器, timeout重置为null
  // 2.debounce函数重置为null

  // 外部取消定时器时需要调用
  // 和flush大致相同

  const clear = function () {
    if (timeout) {
      clearTimeout(timeout)

      timeout = null
      debouncedFn = null
    }
  }

  // 获取防抖函数
  // 调用clar
  // 执行防抖函数
  const flush = function () {
    const fn = debouncedFn
    clear()

    if (fn) {
      fn()
    }
  }

  const wrapper = function (...args) {
    // 直接调用
    // wait为各种False值时
    if (!wait) {
      return fn.apply(this, args)
    }

    // 定时调用
    // 分为两种情况
    // 是否需要立马调用一次
    const callNow = !timeout && callFirst
    const context = this
    clear()

    debouncedFn = function () {
      return fn.apply(context, args)
    }
    
    timeout = setTimeout(() => {
      timeout = null

      if (!callNow) {
        const call = debouncedFn
        debouncedFn = null

        return call()
      }
    }, wait);

    if (callNow) {
      return debouncedFn()
    }

  }

  wrapper.cancel = clear
  wrapper.flush = flush

  return wrapper

}

const fn = debounce(function (a) {
  console.log('debounce', a)
}, 500, false)

fn('lh')
fn('dg')
fn('jg')

// fn.flush()
// fn.cancel()