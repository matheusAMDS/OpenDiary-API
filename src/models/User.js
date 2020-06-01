const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false,
    required: true,
    set: pwd => bcrypt.hashSync(pwd, 10)
  },
  userPic: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  peeking: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    }
  ],
  peekedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    }
  ]
})

module.exports = mongoose.model('users', UserSchema)