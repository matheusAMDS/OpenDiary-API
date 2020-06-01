const bcrypt = require('bcryptjs')
const { generateToken } = require('../utils/auth')
const { ForbiddenError } = require('apollo-server')

const User = require('../models/User')

module.exports = {
  async register (_, { name, email, password }) {
    let user = await User.findOne({ email })

    if (user) 
      throw new ForbiddenError('Email already being used')
    
    user = await User.create({
      name,
      email,
      password,
      username: email.split("@")[0],
      bio: "",
      userPic: "https://res.cloudinary.com/drfbqgx7n/image/upload/v1589947848/images_pfj6n3.png"
    })
    
    return generateToken(user._id)
  },
  
  async login (_, { email, password }) {
    const user = await User.findOne({ email }).select('+password')

    if (!user)
      throw new ForbiddenError("Email not registered")
      
    const validatePwd = await bcrypt.compare(password, user.password)

    if (!validatePwd)
      throw new ForbiddenError("Wrong password")

    return generateToken(user._id)
  }
}