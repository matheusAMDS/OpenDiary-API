const { gql } = require('apollo-server')

const schema = gql`
  type Query {
    user(username: String!): User
    users: [User]!
    post(postId: ID!): Post
    comments(postId: ID!): [Comment]!
    profile(username: String!, page: Int): Feed!
    feed(page: Int): Feed!
    me: User!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
    createPost(text: String, images: [Upload]): Post
    createComment(text: String!, to: ID!): Comment
    peek(toUser: String!): String!
    unpeek(toUser: String!): String!
    updateBio(bio: String!): String!
    updateUserPic(userPic: Upload!): String!
    like(to: ID!, model: String!): Int!
    dislike(to: ID!, model: String!): Int!
  }

  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
    userPic: String
    bio: String
    peeking: [ID]!
    peekedBy: [ID]!
  }

  type Post {
    _id: ID!
    byUser: User!
    text: String
    images: [String]!
    likes: [ID]!
    likeCount: Int!
    commentsCount: Int!
    comments: [Comment]!
    createdAt: String!
  }

  type Comment {
    _id: ID!
    byUser: User!
    text: String!
    likes: [ID]!
    likeCount: Int!
    createdAt: String!
  }

  type Feed {
    docs: [Post]! 
    page: Int
    hasNextPage: Boolean!
    prevPage: Int
    nextPage: Int
    totalDocs: Int!
    totalPages: Int!
  }
`

module.exports = schema