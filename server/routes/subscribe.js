const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

router.post('/subscribeNumber', async (req, res) => {
    try {        
        const subscribe = await Subscriber.find({ 'userTo' : req.body.userTo }).exec();
        return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message })
    }
});

router.post('/subscribed', async (req, res) => {
    try {
        
        const subscribe = await Subscriber.find({ 'userTo' : req.body.userTo, 'userFrom': req.body.userFrom }).exec();
        let result = false;

        if (subscribe.length !== 0) {
            result = true;
        }
        
        return res.status(200).json({ success: true, subscribed: result })
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message })
    }
});

router.post('/unsubscribe', async (req, res) => {
    try {        
        if (!req.body.userTo || !req.body.userFrom) {
            return res.status(400).json({ success: false, message: 'Missing userTo or userFrom' });
        }

        const doc = await Subscriber.findOneAndDelete({ 
            'userTo' : req.body.userTo,
            'userFrom': req.body.userFrom 
        }).exec();

        return res.status(200).json({ success: true, doc })
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message })
    }
});

router.post('/subscribe', async (req, res) => {
    try {     
        const subscribe = Subscriber(req.body);        
        await subscribe.save();        
        
        return res.status(200).json({ success: true  })
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message })
    }
});


module.exports = router;
