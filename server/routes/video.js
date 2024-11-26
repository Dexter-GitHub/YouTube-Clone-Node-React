const express = require('express');
const router = express.Router();
// const { Video } = require('../models/Video');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({    
    /* 어디에 파일을 저장할 것인지 결정 */
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
        return cb(new Error('Only .mp4 files are allowed'), false);
    }
    cb(null, true)
}

const upload = multer({ 
    storage: storage ,
    fileFilter: fileFilter
}).single("file");

router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if (err) {
            console.error(err.message);
            return res.status(400).json({ success: false, message: err.message })
        }
        return res.json({ success: true, url: req.file.path, fileName: req.file.filename })
    })
})

module.exports = router;
