// INDEX.JS
require('dotenv').config()
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const cors = require('cors')
const express = require('express')
const app = express()
const port = parseInt(process.env.PORT, 10) || 8080

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res, next) => {
  res.send('There is no interesting here!')
})


app.post('/upload', (req, res, next) => {
  const imageBuffer = new Buffer.from(req.body.base64Str, 'base64')
  fs.writeFile(`${process.env.UPLOAD_FOLDER}sharingImage.png`, imageBuffer , function (err) {
    if (err) return next(err)

    // SEND FILE TO CLOUDINARY
    const path = `${process.env.UPLOAD_FOLDER}sharingImage.png`
    const uniqueFilename = new Date().toISOString()

    cloudinary.uploader.upload(
      path,
      { 
        public_id: `${process.env.CLOUDINARY_UPLOAD_FOLDER}/${uniqueFilename}`, 
        tags: `quiz`
      }, // directory and tags are optional
      function(err, image) {
        if (err) return res.send(err)
        console.log('file uploaded to Cloudinary')
        // remove file from server
        const fs = require('fs')
        fs.unlinkSync(path)
        // return image details
        res.json(image)
      }
    )
  })
})

app.listen(port)