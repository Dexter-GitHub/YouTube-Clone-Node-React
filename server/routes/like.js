const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

router.post('/getLikes', async (req, res) => {
    let variable = req.body.videoId ?
        { videoId: req.body.videoId } :    
        { commentId: req.body.commentId }
    
    try {

        const likes = await Like.find(variable);
        
        return res.status(200).json({ success: true, likes });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
});

router.post('/getDislikes', async (req, res) => {
    let variable = req.body.videoId ? 
        { videoId: req.body.videoId } :
        { commentId: req.body.commentId }
    
    try {
        const dislikes = await Dislike.find(variable);            
        
        return res.status(200).json({ success: true, dislikes });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
});

router.post('/upLike', async (req, res) => {
    let variable = req.body.videoId ?
        { videoId: req.body.videoId, userId: req.body.userId } :
        { commentId: req.body.commentId, userId: req.body.userId }

    // Like collection 에다가 클릭 정보를 넣어 준다.
    const like = new Like(variable);

    try {
        await like.save();
            
        // 만약에 Dislike이 이미 클릭이 되었다면, Dislike를 1 줄여준다.    
        await Dislike.findOneAndDelete(variable);
            
        res.status(200).json({ success: true })
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
});

router.post('/unLike', async (req, res) => {
    let variable = req.body.videoId ?
        { videoId: req.body.videoId, userId: req.body.userId } :
        { commentId: req.body.commentId, userId: req.body.userId }

    try {
        await Like.findOneAndDelete(variable);

        res.status(200).json({ success: true })
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
});

router.post('/unDislike', async (req, res) => {
    let variable = req.body.videoId ?
        { videoId: req.body.videoId, userId: req.body.userId } :
        { commentId: req.body.commentId, userId: req.body.userId }

    try {
        await Dislike.findOneAndDelete(variable);

        res.status(200).json({ success: true })
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
});

router.post('/upDislike', async (req, res) => {
    let variable = req.body.videoId ?
        { videoId: req.body.videoId, userId: req.body.userId } :
        { commentId: req.body.commentId, userId: req.body.userId }

    // Like collection 에다가 클릭 정보를 넣어 준다.
    const dislike = new Dislike(variable);

    try {
        await dislike.save();
            
        // 만약에 Like이 이미 클릭이 되었다면, Like를 1 줄여준다.    
        await Like.findOneAndDelete(variable);
            
        res.status(200).json({ success: true })
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
});

module.exports = router;
