const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const app = express()

const port = process.env.PORT || 1337
const jwtSecret = process.env.JWT_SECRET || 'secret'
const db = {}

function auth (req, res, next) {
  const token = req.headers['authorization']

  if (!token) {
    return res.sendStatus(401)
  }

  // Client 1
  if (token.startsWith('JWT ')) {
    const decoded = jwt.verify(token.slice(4), jwtSecret)

    return db[decoded.clientId] ? next() : res.sendStatus(401)
  }

  // Client 2
  if (token.startsWith('JWT2 ')) {
    const payload = jwt.decode(token.slice(5))
    try {
      jwt.verify(token.slice(5), db[payload.clientId].secret)
    } catch (err) {
      return res.sendStatus(401)
    }

    return next()
  }

  res.sendStatus(401)
}

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization')
  next()
})

app.post('/register', (req, res) => {
  const clientId = '' + (Math.floor(Math.random() * 1000000) + 1000000)
  const secret = '' + (Math.floor(Math.random() * 100000000) + 100000000)

  db[clientId] = { secret }
  const token = jwt.sign({ clientId }, jwtSecret)

  res.json({
    // Client 1
    token,

    // Client 2
    clientId,
    secret
  })
})

app.get('/something', auth, (req, res) => res.json({ message: 'Something' }))
app.get('/something-else', auth, (req, res) => res.json({ message: 'Something Else' }))

app.listen(port, () => console.log(`Listening on :${port}`))
