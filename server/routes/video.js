const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
var ffmpeg = require('fluent-ffmpeg');
const { Video } = require('../models/VideoModel');

// ffmpeg 경로를 수동으로 지정
ffmpeg.setFfmpegPath('C:/ffmpeg-2024-11-25/bin/ffmpeg.exe');
// ffprobe 경로를 수동으로 지정
ffmpeg.setFfprobePath('C:/ffmpeg-2024-11-25/bin/ffprobe.exe');

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

router.post('/uploadVideo', (req, res) => {
    // 비디오 정보를 저장 한다.
    const video = new Video(req.body);

    video.save()
        .then(() => {
            return res.status(200).json({ success: true })
        })
        .catch(err => {
            return res.json({ success: false, err })
        })    
})

router.get('/getVideos', async (req, res) => {
    // 비디오를 DB 에서 가져와서 클라이언트에 보낸다.
    try {        
        const videos = await Video.find().populate('writer').exec();
        console.log(videos);
        return res.status(200).json({ success: true, videos });

    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }    
})

router.post('/thumbnail', async (req, res) => {
    // 썸네일 생성 하고 비디오 러닝타임 가져오기
    let filePath = "";
    let fileDuration = "";
    try {
        //비디오 정보 가져오기
        fileDuration = await new Promise((resolve, reject) => {            
            ffmpeg.ffprobe(req.body.url, (err, metadata) => {
                if (err) {
                    console.error("Error during ffprobe: ", err);
                    return reject(err);
                }
                console.dir(metadata);
                console.log(metadata.format.duration);
                resolve(metadata.format.duration);            
            });
        });

        // 썸네일 생성
        ffmpeg(req.body.url)
            .on('filenames', function (filenames) {
                console.log('Will generate ' + filenames.join(', '));
                console.log(filenames);

                filePath = "uploads/thumbnails/" + filenames[0];
            })
            .on('end', function () {
                console.log('Screenshots taken');
                return res.json({ success: true, url: filePath, fileDuration: fileDuration });
            })
            .on('error', function (err) {
                console.log(err);
                return res.json({ success: false, message: err.message });
            })
            .screenshots({
                // Will take screenshots at 20%, 40%, 60% and 80% of the video
                count: 3,
                folder: 'uploads/thumbnails',
                size: '320x240',
                // '%b': input basename (filename w/o extension)
                filename: 'thumbnail-%b.png'
            })
    } catch (err) {
        console.error("Error: ", err);
        return res.json({ success: false, message: err.message });
    }
})

module.exports = router;
