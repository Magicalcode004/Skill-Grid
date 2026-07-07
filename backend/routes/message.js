const express = require('express');
const router  = express.Router();
const Message = require('../MessageSchema');
const checkauth = require('../middleware/checkauth');
const Request = require ('../RequestSchema');
// GET — chat history fetch 
router.get('/:requestId', checkauth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        const isParticipant =
            request.client.toString() === req.user.id ||
            request.worker.toString() === req.user.id;

        if (!isParticipant) {
            return res.status(403).json({ message: 'Not allowed' });
        }

        const messages = await Message.find({ requestId: req.params.requestId })
            .sort({ createdAt: 1 });
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