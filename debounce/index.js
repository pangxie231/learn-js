// 防抖函数

// 基础防抖
// 是否立即执行一次
// cancel 直接调用函数 取消函数
// flush，直接调用函数，立即执行

// 分析的时候应该知道每一步的时候，作用域内有哪些变量可用
// 这样就能更好的知道，用这些变量来做一些事情，或者对它进行清理

// 接收三个参数
// fn 防抖函数
// wait 防抖的时间
// callFirst 是否需要立即执行一次
function debounce(fn, wait, callFirst) {

  // 
  var timeout = null;
  var debouncedFn = null;

  var clear = function () {
    if (timeout) {
      clearTimeout(timeout);

      debouncedFn = null;
      timeout = null;
    }
  };

  var flush = function () {
    var call = debouncedFn;
    clear();

    if (call) {
      call();
    }
  };

  var debounceWrapper = function () {
    if (!wait) {
      return fn.apply(this, arguments);
    }

    var context = this;
    var args = arguments;
    var callNow = callFirst && !timeout;
    clear();

    debouncedFn = function () {
      fn.apply(context, args);
    };

    timeout = setTimeout(function () {
      timeout = null;

      if (!callNow) {
        var call = debouncedFn;
        debouncedFn = null;

        return call();
      }
    }, wait);

    if (callNow) {
      return debouncedFn();
    }
  };

  debounceWrapper.cancel = clear;
  debounceWrapper.flush = flush;

  return debounceWrapper;
}
const fn = debounce(function (a) {
  console.log('debounce', a)
}, 500)

fn('lh')
fn('dg')
fn('jg')
fn.flush()
// fn.cancel()
