const multer = require("multer")

const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp", 
}
// keep the file in memory, then send the buffer to cloudinary
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    if (isValid) {
        cb(null, true)
    } else {
        cb(new Error("Invalid image type"), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }   // 2 MB
})

module.exports = upload

