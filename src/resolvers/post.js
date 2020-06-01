const Post = require('../models/Post')
const User = require('../models/User')

const upload = require('../utils/upload')
 
const { AuthenticationError } = require('apollo-server')

module.exports = {
  async post(_, { postId }) {
    return await Post.findById(postId)
      .populate('byUser')
      .populate({
        path: "comments",
        populate: {
          path: "byUser",
        }
      })
  },

  async createPost(_, { text, images }, { user }) {
    if (!user) 
      throw new AuthenticationError('Must be authenticated')

    let uploadsResp
    
    if (images)
      uploadsResp = await Promise.all(images.map(image => upload(image)))

    const newPost = await Post.create({
      text,
      images: uploadsResp ? uploadsResp.map(resp => resp.url) : [],
      byUser: user.id,
      likes: [],
      comments: []
    })

    return await newPost.populate('byUser').execPopulate()
  },

  async feed(_, { page=1 }, { user }) {
    if (!user) 
      throw new AuthenticationError('Must be authenticated')

    user = await User.findById(user.id)
    
    const posts = await Post.paginate({ 
      $or: [
        { byUser: user.peeking.concat([ user._id ]) }, 
        { likes: user.peeking.concat([ user._id ]) },
      ],
    }, {
      page,
      limit: 10,
      populate: 'byUser',
      sort: { createdAt: 'desc' }
    }) 

    return posts
  }
}
