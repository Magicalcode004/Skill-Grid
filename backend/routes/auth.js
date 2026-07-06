const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../UserSchema');
const upload = require('../middleware/upload');
const checkauth = require('../middleware/checkauth');

const router = express.Router();

// REGISTER 
router.post('/register', upload.single('photo'), async (req, res) => {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    try {
        const { name, email, password, phone, role, profession, experience, location } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists with this email" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            profession: role === 'worker' ? profession : undefined,
            experience: role === 'worker' ? experience : undefined,
            location: role === 'worker' ? location : undefined,
            photo: req.file ? `/uploads/${req.file.filename}` : ''
        });

        await user.save();
        res.status(201).json({ message: "Account created successfully" });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).send("Server Error");
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Email" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

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

// USER PROFILE
router.get('/profile', checkauth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// UPDATE PROFILE
router.put('/profile', checkauth, async (req, res) => {
    try {
        // Sirf wahi cheezein destructure ki hain jo update karni hain
        const { name, phone, profession, experience, location, chargeType, chargeAmount } = req.body;

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User Not found" });

        // Basic Info Update
        if (name) user.name = name;
        if (phone) user.phone = phone;

        // Worker Specific Info Update
        if (user.role === 'worker') {
            if (profession) user.profession = profession;
            if (location) user.location = location;
            if (experience) user.experience = experience;
            if (chargeType) user.chargeType = chargeType;
            if (chargeAmount) user.chargeAmount = chargeAmount;
        }

        await user.save();
        res.json({ message: "Profile updated successfully!", user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});



// GET profile
router.get('/profile', checkauth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PUT update profile
router.put('/profile', checkauth, async (req, res) => {
    try {
        const { name, phone, profession, experience, location } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { name, phone, profession, experience, location } },
            { new: true }
        ).select('-password');
        res.json({ message: 'Profile updated successfully', user: updated });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
// Check email exists or not — OTP step se pehle
router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'This email is already registered. Please login.' });
        }
        res.status(200).json({ message: 'Email available.' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;