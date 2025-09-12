const http = require('http')

http.createServer((req,res)=> {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "Access-Control-Allow-Origin": "*" // 如果要跨域
  })

  res.write(`data: ${JSON.stringify({message: '连接成功'})}`)

  // 每隔 2 秒推送一次数据
  let counter = 0;
  const timer = setInterval(() => {
    counter++;
    res.write(`data: ${JSON.stringify({ time: Date.now(), counter })}\n\n`);
  }, 2000);


}).listen(3000, ()=> {
  console.log('SSE 服务启动，访问http://localhost:3000/sse')
})