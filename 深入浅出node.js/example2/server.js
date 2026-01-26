var http = require('http')

var fs = require('fs')

function start() {
  http.createServer(function(req, res) {
    if(req.url === '/') {
      getTitles(res)
    }
  })
  .listen(3000)
}

function handleError(err, res) {
  console.log('err', err)
  res.end('Server Error')
}

function getTitles(res) {
  fs.readFile('./title.json', (err, data)=> {
    if(err) {
      return handleError(err, res)
    } else {
      getTemplate(res, JSON.parse(data.toString()))
    }
  })
}

function getTemplate(res, titles) {
  fs.readFile('./template.html', (err, data)=> {
    if(err) {
      return handleError(err, res)
    } else {
      var tmpl = data.toString()
      tmpl = tmpl.replace('%', titles.join('</li><li>'))

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.end(tmpl)
    }
  })
}

start()