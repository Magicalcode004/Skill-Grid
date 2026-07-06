const express = require('express');
const router  = express.Router();
const Message = require('../MessageSchema');
const checkauth = require('../middleware/checkauth');

// GET — chat history fetch 
router.get('/:requestId', checkauth, async (req, res) => {
    try {
        const messages = await Message.find({ requestId: req.params.requestId })
            .sort({ createdAt: 1 }); // purane pehle
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST — message save 
router.post('/send', checkauth, async (req, res) => {
    try {
        const { requestId, message } = req.body;

        const newMsg = new Message({
            requestId,
            senderId:   req.user.id,
            senderName: req.body.senderName,
            message,
        });

        await newMsg.save();
        res.status(201).json(newMsg);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;