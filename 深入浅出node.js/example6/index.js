const fs = require('fs')

const request = require('request')

const htmlparser = require('htmlparser')


const RSSFile = './RSS.txt'

// 检查文件是否存在
function checkForRSSFile() {
  fs.open(RSSFile, (err, fd)=> {
    if(err) {
      return next(err)
    }

    next(null, fd)
  })
}

// 读取文件
function readRSSFile(fd) {
  const buffer = Buffer.alloc(128)
  fs.read(fd, buffer,0,buffer.length,null,(err, bytesRead, data)=> {
    if(err) {
      return next(err)
    }

    const fileContent = data.toString('utf8', 0, bytesRead).trim()
    next(null, {
      fd,
      fileContent
    })
  })

}

function closeRSSFile({ fd, fileContent}) {
  fs.close(fd, (err)=> {
    if(err) {
      return next(err)
    }

    next(null, fileContent)
  })
}

// 下载
function donwloadFile(url) {
  request(url, (err, response, body)=> {
    if(err) {
      return next(err)
    }

    next(null, body)
  })
}

// 解析
function parseResult(result) {
  const handler = new htmlparser.RssHandler()
  const parser = new htmlparser.Parser(handler)
  parser.parseComplete(result)

  if(!handler.dom.items.length) {
    return next(new Error('No RSS items found'))
  }

  const item = handler.dom.items.shift()
  // console.log("🚀 ~ parseResult ~ item:", item)
  console.log(item.title)
  console.log(item.link)
  
}


const tasks = [
  checkForRSSFile,
  readRSSFile,
  closeRSSFile,
  donwloadFile,
  parseResult
]
function next(err, result) {
  if(err) {
    console.log("🚀 ~ next ~ err:", err)
    throw err
  }

  const currentTask = tasks.shift()
  if(currentTask) {
    currentTask(result)
  }
}

next()