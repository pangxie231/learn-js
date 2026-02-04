const http = require('http')

const formidable = require('formidable')

const server = http.createServer((req, res)=> {

  switch(req.method) {
    case 'GET':
      show(res)
      break
    case 'POST':
      upload(req, res)
      break
  }
})

function show(res) {
  const html = `
    <form method="post" enctype="multipart/form-data">
      <p><input type="text" name="name"/></p>
      <p><input type="file" name="file"/></p>
      <p><input type="submit"/></p>
    </form>
  `

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function upload(req, res) {
  if(!isFormData(req)) {
    req.statusCode = 400
    return res.end('Bad Request')
  }

  const form = new formidable.IncomingForm()
  
  form.on('field', (field, value)=> {
    console.log("🚀 ~ upload ~ value:", value)
    console.log("🚀 ~ upload ~ field:", field)
    
  })
  
  form.on('file', (name, file)=> {
    // console.log("🚀 ~ upload ~ file:", file)
    console.log("🚀 ~ upload ~ name:", name)
  })

  // 计算上次进度
  form.on('progress', (bytesReceived, bytesExpected)=> {
    const precentNum = (bytesReceived / bytesExpected * 100).toFixed(2)

   console.log('%' + precentNum)
  })
  
  form.on('end', ()=> {
    res.end('upload complete!')
  })
  form.parse(req)
}

function isFormData(req) {
  const type = req.headers['content-type'] || ''
  return type.indexOf('multipart/form-data') === 0
}

server.listen('3000')