const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../UserSchema');

const router = express.Router();

//REGISTER API
router.post('/register', async (req, res) => {
    console.log("Thunder Client data:", req.body);
    try {
        const { name, email, password, phone, role, profession, experience } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            profession: role === 'worker' ? profession : undefined,
            experience: role === 'worker' ? experience : undefined
        });

        await user.save();
        res.status(201).json({ message: "Account created successfully" });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).send("Server Error");
    }
});

// LOGIN API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const payload = { user: { id: user.id, role: user.role } };
        
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });

        res.json({
            message: "Login Successful",
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;