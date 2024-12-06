const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');

router.post('/saveComment', async (req, res) => {
    try {        
        const comment = new Comment(req.body);        
        await comment.save();        
            
        const result = await Comment.find({'_id' : comment._id })
            .populate('writer')
            .exec();

        return res.status(200).json({ success: true, result });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
});

router.post('/getComments', async (req, res) => {
    try {            
        const comments = await Comment.find({'postId' : req.body.videoId })
            .populate('writer')
            .exec();
        
        return res.status(200).json({ success: true, comments });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
});

module.exports = router;
