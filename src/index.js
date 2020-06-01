require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const { authenticate } = require('./utils/auth')

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: authenticate(req)
  })
})

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`)
})