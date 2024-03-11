const multer = require('multer')
const path = require('path')
const fs = require('fs')

module.exports = () => {
    const maxSize = 5 * 1024 * 1024
    const tempDataPath = './user_data/temp_data'
    if (!fs.existsSync(tempDataPath)) {
        fs.mkdirSync(tempDataPath, { recursive: true })
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, tempDataPath)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname))
        },
    })

    return multer({
        storage,
        limits: { fileSize: maxSize },
    })
}