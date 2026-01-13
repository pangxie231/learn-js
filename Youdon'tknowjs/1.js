// with
function fnWith(obj) {
  with(obj) {
    // a = 2
    console.log(a)
  }
}

var obj1 = {
  a: 1
}
var obj2 = {
  b: 2
}

// fnWith(obj1)
// // console.log(obj1)
// fnWith(obj2)
// console.log(obj2)
// console.log(a)


// function shareToTwitter() {
//     var text = 'My current on-loop playlist from @Reverse1999_GL. Come vibe with the music and grab your rewards! #The1999MusicReviews #My1999Playlist'; // 默认分享文案
//     var url = window.location.href; // 当前页面URL

//     // 构建URL
//     var twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);

//     // 弹出窗口
//     window.open(twitterUrl, 'blank');
// }


// 函数声明和函数表达式

// 以function开头，就是函数声明，函数的名称标识符(变量)会绑定在当前作用域中
// 也就是说在全局作用域下进行函数声明，可以在全局作用域下访问到它
// function hello() {}

// 这是函数表达式，因为它不是以function开头
// 这个时候函数的名称标识符会绑定到函数自身的作用域中
// 也就是说在全局作用域下进行函数表达式，hello不能在全局作用域中访问，只能在hello这个函数气泡中被访问
// 这样就完全不会污染到它所在的作用域
// (function hello() {})()

// 另外一种匿名函数表达式
(function IIFE(fn){
  fn(window)
})(function def(global) {
  var a = 3
})



// 都是标识符，可以赋值但是不生效
undefined = 100
NaN = 100
Infinity = 100