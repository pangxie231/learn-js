const http = require('http')

const url = require('url')

const items = []

const server = http.createServer(function (req, res) {

  const pathname = url.parse(req.url).pathname
  let queryIndex = pathname.slice(1)
  queryIndex = parseInt(queryIndex)

  switch (req.method) {
    case 'POST':
      let item = ''
      req.setEncoding('utf-8')
      req.on('data', function (chunk) {
        item += chunk
      })
      req.on('end', function () {
        items.push(item)
        res.end('OK\n')
      })
      break
    case 'GET':
      const body = items.map((item, i) => i + '.' + item).join('\n')
      res.setHeader('Content-Length', Buffer.byteLength(body))
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"')
      res.write(body)
      res.end()
      break
    case 'DELETE':
      if (isNaN(queryIndex)) {
        res.statusCode = 400
        return res.end('不合法的参数\n')
      }

      if (!items[queryIndex]) {
        res.statusCode = 400
        return res.end('索引不在范围内\n')
      }

      items.splice(queryIndex, 1)
      res.end('OK\n')
      break
    case 'PUT':
      req.setEncoding('utf-8')
      if (isNaN(queryIndex)) {
        res.statusCode = 400
        return res.end('不合法的参数\n')
      }

      if (!items[queryIndex]) {
        res.statusCode = 400
        return res.end('索引不在范围内\n')
      }

      let requestBody = ''
      req.on('data', (chunk)=> {
        requestBody += chunk
      })
      req.on('end', ()=> {
        try {
          const data = JSON.parse(requestBody) 
          console.log("🚀 ~ requestBody:", requestBody)
          console.log("🚀 ~ data:", data)
          items.splice(queryIndex, 1, data.value)
          res.end('OK\n')
        } catch (error) {
          console.log("🚀 ~ error:", error)
          res.statusCode = '501'
          res.end('Service Error')
        }
      })

      break
  }
})

server.listen('3000')
