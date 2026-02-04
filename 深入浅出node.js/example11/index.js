
const mysql = require('mysql2')

const http = require('http')

const work = require('./lib/timetrack')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0116',
  database: 'test_db'
})

const server = http.createServer(function(req, res) {
  switch(req.method) {
    case 'POST':
      switch(req.url) {
        case '/':
          work.add(db, req, res)
          break
        case '/archive':
          work.archive(db, req, res)
          break
        case '/delete':
          work.remove(db, req, res)
          break
      }
      break
    case 'GET':
      switch(req.url) {
        case '/':
          work.show(db, res)
          break
        case '/archive':
          work.showArchived(db, res)
          break
      }
      break
  }

})

db.connect()

db.query(`
  CREATE TABLE IF NOT EXISTS work (
    id INT(10) NOT NULL AUTO_INCREMENT,
    hours DECIMAL(5,2) DEFAULT 0,
    date DATE,
    archived INT(1) DEFAULT 0,
    description LONGTEXT,
    PRIMARY KEY (id)
  )`, (err)=> {
  if(err) throw err;
  console.log('Server started...')
  server.listen(3000)
})