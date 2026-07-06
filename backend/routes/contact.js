const express = require('express');
const router = express.Router();
const Contact = require('../ContactSchema');

// POST — user message bhejta hai
router.post('/send', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message)
            return res.status(400).json({ message: 'All fields are required' });

        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(201).json({ message: 'Message sent successfully!' });

    } catch (err) {
        console.error('Contact Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// GET — admin saare messages dekhta hai
router.get('/all', async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PUT — admin message ko read mark kare
router.put('/read/:id', async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE — admin message delete kare
router.delete('/delete/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;