var events = require('events')

var net = require('net')

var channel = new events.EventEmitter()

channel.clients = {}
channel.subscriptions = {}

channel.on('join', function(id, client) {
  this.clients[id] = client
  this.subscriptions[id] = function(senderId, message) {
    if(id != senderId) {
      this.clients[id].write(message)
    }
  }

  this.on('broadcast', this.subscriptions[id])

  var welcome = 'Welcome' + '\n' + 'Gusets online: ' + this.listeners('broadcast').length + '\n'
  client.write(welcome)
})

channel.on('leave', function(id) {
  channel.removeListener('broadcast', this.subscriptions[id])
  channel.clients[id] = null
  channel.subscriptions[id] = null

  console.log('channel.clients', Object.keys(channel.clients))
  console.log('channel.subscriptions', Object.keys(channel.subscriptions))
})

// 关掉服务
channel.on('shutdown', function(id) {
  channel.emit('broadcast', id, 'Chat has shut down!')
  channel.removeAllListeners()
})

var server = net.createServer(function(client) {
  var id = client.remoteAddress + ':' + client.remotePort
  console.log("🚀 ~ id:", id)
  console.log('join')
  channel.emit('join', id, client)
  // client.on('connection', function(){
  // })
  client.on('data', function(data) {
    data = data.toString()
    console.log("🚀 ~ data:", data)
    console.log("🚀 ~ data === 'shutdown':", data === 'shutdown')
    if(data === 'shutdown\r\n') {
      channel.emit('shutdown', id)
      return
    }

    channel.emit('broadcast', id, data)
  })

  client.on('close', function() {
    channel.emit('leave', id)
  })
})

server.listen(8888)