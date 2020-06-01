const { AuthenticationError, UserInputError } = require('apollo-server')

const Post = require('../models/Post')
const Comment = require('../models/Comment')

function getModel(model) {
  model = model.toUpperCase()

  const ModelMap = {
    POST: Post,
    COMMENT: Comment 
  }

  if (Object.keys(ModelMap).includes(model))
    return ModelMap[model]
  else 
    throw new UserInputError('Unknown model')
}

module.exports = {
  async like(_, { to, model }, { user }) {
    if (!user) 
      throw new AuthenticationError('Must be authenticated')

    const Model = getModel(model)
    
    try {
      const doc = await Model.findByIdAndUpdate(to, {
        $addToSet: { likes: user.id}
      }, { 
        new: true
      })

      return doc.likeCount
    } catch (error) {
      console.log(error)
    }
    
  },

  async dislike(_, { to, model }, { user }) {
    if (!user) 
      throw new AuthenticationError('Must be authenticated')

    const Model = getModel(model)
    
    try {
      const doc = await Model.findByIdAndUpdate(to, {
        $pull: { likes: user.id }
      }, { 
        new: true
      })

      return doc.likeCount
    } catch (error) {
      console.log(error)
    }
  }
}