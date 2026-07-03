const express = require('express');
const router = express.Router();
const User = require('../UserSchema');


router.get('/users', async (req, res) => {
    try {
        
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});


router.delete('/user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;