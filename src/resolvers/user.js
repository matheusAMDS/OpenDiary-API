const { AuthenticationError, ForbiddenError } = require('apollo-server')
const upload = require('../utils/upload')

const User = require('../models/User')
const Post = require('../models/Post')

module.exports = {
  async me(_, __, { user }) {
    if (!user)
      throw new AuthenticationError('Must be authenticated')

    return await User.findById(user.id)
  },

  async user(_, { username }) {
    return await User.findOne({ username })
  },

  async users(_) {
    return await User.find().limit(6)
  },

  async peek(_, { toUser }, { user }) {
    if (!user)
      throw new AuthenticationError('Must be authenticated')

    const peekedUser = await User.findOne({ username: toUser })

    if (!peekedUser)
      throw new ForbiddenError('User does not exist')

    await User.findByIdAndUpdate(user.id, {
      $addToSet: { peeking: peekedUser._id }
    })

    peekedUser.peekedBy.push(user.id)
    peekedUser.save()

    return "Peeking"
  },

  async unpeek(_, { toUser }, { user }) {
    if (!user)
      throw new AuthenticationError('Must be authenticated')

    const peekedUser = await User.findOne({ username: toUser })
    
    if (!peekedUser)
      throw new ForbiddenError('User does not exist')

    await User.findByIdAndUpdate(user.id, {
      $pull: { peeking: peekedUser._id }
    })

    peekedUser.peekedBy.pull(user.id)
    peekedUser.save()

    return "Unpeeked"
  },

  async profile(_, { username, page }) {
    const user = await User.findOne({ username })
    let posts = await Post.paginate({ byUser: user._id }, {
      page,
      limit: 10,
      populate: 'byUser',
      sort: { createdAt: 'desc' }
    })

    return posts
  },

  async updateUserPic(_, { userPic }, { user }) {
    if (!user)
      throw new AuthenticationError('Must be authenticated')

    try {
      const uploadResp = await upload(userPic, true)
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { userPic: uploadResp.url },
        { new: true }
      )

      return updatedUser.userPic
    } catch (error) {
      console.log(error)
    }
    
  },

  async updateBio(_, { bio }, { user }) {
    if (!user)
      throw new AuthenticationError('Must be authenticated')
    
    const updatedUser = await User.findByIdAndUpdate(
      user.id, 
      { bio }, 
      { new: true }
    )

    return updatedUser.bio
  }
}