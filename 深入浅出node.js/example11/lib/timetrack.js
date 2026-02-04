const qs = require('querystring')

function add(db, req, res) {
  parseReceivedData(req, (work)=> {
    db.query(
      'INSERT INTO work (hours, date, description) ' +
      'VALUES (?, ? ,?)',
      [work.hours, work.date, work.description],
      (err)=> {
        if(err) throw err
        show(db, res)
      }
    )
  })
}


function archive(db, req, res) {
  parseReceivedData(req, (work) => {
    db.query(
      'UPDATE work SET archived=1 WHERE id=?',
      [work.id],
      (err) => {
        if (err) throw err
        show(db, res)
      }
    )
  })
}

function remove(db, req, res) {
  parseReceivedData(req, (work) => {
    db.query(
      'DELETE FROM work WHERE id=?',
      [work.id],
      (err) => {
        if (err) throw err
        show(db, res)
      }
    )
  })
}


function show(db, res, showArchived) {
  const query = 'SELECT * FROM work ' +
    'WHERE archived=? ' +
    'ORDER BY date DESC'
  const archiveValue = showArchived ? 1 : 0
  db.query(
    query,
    [archiveValue],
    (err, rows)=> {
      if(err) throw err
      let html = (showArchived)
        ? ''
        :`<a href="/archive">Archived Work</a><br/>`
      html += workHitlistHtml(rows)
      html += workFormHtml()
      sendHTML(res, html)
    }
  )
}

function showArchived(db, res) {
  show(db, res, true)
}


function workHitlistHtml(rows) {
  let html = '<table>'
  for(var i in rows) {
    html += '<tr>'
    html += `<td> ${rows[i].date} </td>`
    html += `<td> ${rows[i].hours} </td>`
    html += `<td> ${rows[i].description} </td>`

    if(!rows[i].archived) {
      html += `<td> ${workArchiveForm(rows[i].id)} </td>`
    }

    html += `<td> ${workDeleteForm(rows[i].id)} </td>`
    html += '</tr>'
  }
  html += '</table>'
  return html
}

function workFormHtml() {
  const html = `
    <form method="POST" action="/">
      <p>Date (YYYY-MM-DD): <br/> <input name="date" type="text"></p>
      <p>Hours worked: <br/> <input name="hours" type="text"/></p>
      <p>Description:<br/> <textarea name="description"></textarea> </p>
      <input type="submit" value="Add"/>
    </form>
  `
  return html
}

function workArchiveForm(id) {
  return actionForm(id, '/archive', 'Archive')
}

function workDeleteForm(id) {
  return actionForm(id, '/delete', 'Delete')
}


function sendHTML(res, html) {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function parseReceivedData(req, cb) {
  req.setEncoding('utf8')

  let body = ''
  req.on('data', chunk => {
    body += chunk
  })
  req.on('end', () => {
    const obj = qs.parse(body)
    cb(obj)
  })
}

function actionForm(id, path, label) {
  const html = `
  <form method="POST" action="${path}">
    <input type="hidden" name="id" value="${id}"/>
    <input type="submit" value="${label}"/>
  </form>
  `

  return html
}

module.exports = {
  add,
  archive,
  remove,
  show,
  showArchived,
  parseReceivedData,
  actionForm
}