const fs = require('node:fs')
const path = require('node:path')

const regex = /^\/api\/(.*)$/
const userinfo = 'portail/userinfo'

module.exports = function (req, res, next) {
  if (regex.test(req.url)) {
    const uri = req.url.match(regex)[1]
    let filePath = path.join(__dirname, `../api/${uri}.json`)
    let contentType = 'application/json'

    if (uri == userinfo) {
      filePath = path.join(__dirname, `../api/${userinfo}`)
      contentType = 'text/plain'
    }

    try {
      const data = fs.readFileSync(filePath, 'utf8')
      res.setHeader('Content-Type', contentType)
      res.send(data)
    }
    catch (_) {
      res.status(404).send('Erreur de lecture du fichier')
    }
  }
  else {
    next()
  }
}
