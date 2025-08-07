const fs = require('node:fs')
const path = require('node:path')

module.exports = function (req, res, next) {
  if (/^\/userinfo$/.test(req.url)) {
    const filePath = path.join(__dirname, '../userinfo')
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      res.setHeader('Content-Type', 'text/plain')
      res.send(data)
    }
    catch (err) {
      res.status(500).send('Erreur de lecture du fichier')
    }
  }
  else {
    next()
  }
}
