const jwt = require('jsonwebtoken')

const ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN

module.exports.generateToken = id => {
  return jwt.sign({ id }, ACCESS_TOKEN, { expiresIn: '1d' })
}

module.exports.authenticate = req => {
  const auth = req.headers.authorization

  if (!auth) return null

  const [ _, token ] = auth.split(' ')
  
  return jwt.verify(token, ACCESS_TOKEN)
}