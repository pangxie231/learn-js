const http = require('http')

const path = require('path')

const fs = require('fs')

const url = require('url')

const server = http.createServer((req, res) => {
  // if(req.url === '/index.html') {



  const parseUrl = url.parse(req.url)

  const staticUrl = path.join(__dirname, 'public', parseUrl.pathname)
  fs.stat(staticUrl, (err, stat) => {
    if(err) {
      if (err.code === 'ENOENT') {
        res.statusCode = '404'
        res.end('Not Found')
      } else {
        res.statusCode = 500
        res.end('Internal Server Error')
      }
    } else {
      res.setHeader('Content-Length', stat.size)
      const stream = fs.createReadStream(staticUrl)
      stream.pipe(res)
      stream.on('error', (err) => {
        console.log("🚀 ~ err:", err)
        res.statusCode = 500
        res.end('Internal Server Error')
      })
    }
  })

  // stream.on('data', (chunk)=> {
  //   res.write(chunk)
  // })
  // stream.on('end', ()=> {
  //   res.end()
  // })
  // }

})

server.listen('3000')