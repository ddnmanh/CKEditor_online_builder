const express = require('express')
const cors = require('cors')
const multipart = require('connect-multiparty')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// static files
app.use(express.static(path.join(__dirname, 'assets')))

app.get('/', (req, res) => {
  res.send('Backend for tests upload image with CKEditor')
}) 

// Upload image
const multipartMiddleware = multipart({ uploadDir: path.join(__dirname, 'assets/image_Upload_CKEditor') })
app.post('/ckeditor/upload-image', multipartMiddleware, (req, res) => {
  const imagePath = req.files.image.path
  res.json({image_url: `${req.protocol}://${req.get('host')}/image_Upload_CKEditor/` + path.basename(imagePath)})
})
// End 

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})