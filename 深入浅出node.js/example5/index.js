var util = require('util')

var events = require('events')

var fs = require('fs')

var path = require('path')

var chokidar = require('chokidar')

function Watcher(watchDir, processDir) {
  this.watchDir = watchDir 
  this.processDir = processDir
}

// 继承自EventEmitter
util.inherits(Watcher, events.EventEmitter)

Watcher.prototype.watch = function(filePath) {
  this.emit('process', filePath)
}

Watcher.prototype.start = function() {
  var watcher = this
  // fs.watch(watchDir, function(eventType, filename) {
  //   // if(eventType === 'rename') {
  //     watcher.watch(filename)
  //   // }
  // })

  var chokidarWatcher = chokidar.watch(this.watchDir, {})
  
  chokidarWatcher.on('all', function(eventType, filePath) {
    console.log("🚀 ~ filePath:", filePath)
    if(['add','change'].includes(eventType)) {
      watcher.watch(filePath)
    }
  })
  

}


var watchDir = './watch'
var processDir = './done'

var watcher = new Watcher(watchDir, processDir)
watcher.on('process', function(filePath) {
  // 自定义处理
  fs.rename(path.join(__dirname, filePath), path.join(__dirname, 'done',path.basename(filePath).toLowerCase()), function(err) {
    if(err) {
      console.log("🚀 ~ err:", err)
    }
  })

})
watcher.start()