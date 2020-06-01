const sessionResolver = require('./resolvers/session')
const postResolver = require('./resolvers/post')
const userResolver = require('./resolvers/user')
const commentResolver = require('./resolvers/comment')
const ratingResolver = require('./resolvers/rating')

module.exports = {
  Query: {
    post: postResolver.post,
    comments: commentResolver.comments,
    profile: userResolver.profile,
    feed: postResolver.feed,
    users: userResolver.users,
    user: userResolver.user,
    me: userResolver.me
  },
  Mutation: {
    register: sessionResolver.register,
    login: sessionResolver.login,
    createPost: postResolver.createPost,
    createComment: commentResolver.createComment,
    peek: userResolver.peek,
    unpeek: userResolver.unpeek,
    updateBio: userResolver.updateBio,
    updateUserPic: userResolver.updateUserPic,
    like: ratingResolver.like,
    dislike: ratingResolver.dislike
  }
}