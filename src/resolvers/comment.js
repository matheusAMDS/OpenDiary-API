const { AuthenticationError, UserInputError } = require('apollo-server')

const Comment = require('../models/Comment')
const Post = require('../models/Post')

module.exports = {
  async comments(_, { postId }) {
    const post = await Post.findById(postId)
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'comments',
        populate: {
          path: 'byUser'
        }
      })

    return post.comments
  },

  async createComment(_, { text, to }, { user }) {
    if (!user) 
      throw new AuthenticationError('Must be authenticated')

    const post = await Post.findById(to)

    if (!post)
      throw new UserInputError('The post does not exist')
    
    const comment = await Comment.create({ 
      text,
      byUser: user.id
    })

    post.comments.push(comment._id)
    await post.save()

    return await comment.populate('byUser').execPopulate()
  }
}