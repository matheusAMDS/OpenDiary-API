const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: false 
  },
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
  ]
}, {
  toJSON: { virtuals: true },
  timestamps: true
})

CommentSchema.plugin(mongoosePaginate)

CommentSchema.virtual('likeCount').get(function() {
  return this.likes.length
})

module.exports = mongoose.model('comments', CommentSchema)