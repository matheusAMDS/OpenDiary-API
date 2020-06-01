const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: false 
  },
  images: [
    {
      type: String,
      required: false 
    }
  ],
  byUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true 
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: false
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comments',
      required: false
    }
  ]
}, {
  toJSON: { virtuals: true },
  timestamps: true
})

PostSchema.plugin(mongoosePaginate)

PostSchema.virtual('likeCount').get(function() {
  return this.likes.length
})

PostSchema.virtual('commentsCount').get(function() {
  return this.comments.length
})

module.exports = mongoose.model('posts', PostSchema)