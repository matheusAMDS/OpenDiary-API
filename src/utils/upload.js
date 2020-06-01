const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

module.exports = async (file, isUserPic = false) => {
  const { createReadStream } = await file
  
  const uploader = async createReadStream => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(isUserPic
        ? {
          width: "110",
          height: "135",
          crop: "thumb",
        }
        : {}
      , (err, result) => {
        if (result) {
          resolve(result)
        } else 
          reject(err)
      })
      
      createReadStream().pipe(uploadStream)
    })
  }

  const resp = await uploader(createReadStream)

  return resp
}