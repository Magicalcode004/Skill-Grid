const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../UserSchema');
const upload = require('../middleware/upload');
const checkauth = require('../middleware/checkauth');
const {sendOtpEmail} = require('../utils/mailer');

const router = express.Router();



const otpStore = new Map();

// STEP 1: OTP generate 
router.post('/send-otp', async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'This email is already registered. Please login.' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

        try {
            await sendOtpEmail(email, name, otp);
        } catch (mailErr) {
            console.error('Email send error:', mailErr.message);
            otpStore.delete(email);
            return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
        }

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// STEP 2: OTP verify (backend)
router.post('/verify-otp', (req, res) => {
    try {
        const { email, otp } = req.body;
        const record = otpStore.get(email);

        if (!record) return res.status(400).json({ message: 'OTP expired or not requested. Please resend OTP.' });
        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP expired. Please resend OTP.' });
        }
        if (record.otp !== otp) return res.status(400).json({ message: 'Incorrect OTP.' });

        otpStore.delete(email);

        const regToken = jwt.sign({ email, purpose: 'register' }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.status(200).json({ message: 'OTP verified', regToken });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// REGISTER 
router.post('/register', upload.single('photo'), async (req, res) => {
    try {
        const { name, email, password, phone, role, profession, experience, location, regToken } = req.body;

        // Security: No registration until OTP verified
        if (!regToken) return res.status(403).json({ message: 'Email verification required. Please verify OTP first.' });

        let decoded;
        try {
            decoded = jwt.verify(regToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ message: 'Verification expired. Please verify OTP again.' });
        }
        if (decoded.purpose !== 'register' || decoded.email !== email) {
            return res.status(403).json({ message: 'Email verification mismatch. Please verify OTP again.' });
        }

        const safeRole = (role === 'worker') ? 'worker' : 'client';

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists with this email" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: safeRole,
            profession: safeRole === 'worker' ? profession : undefined,
            experience: safeRole === 'worker' ? experience : undefined,
            location: safeRole === 'worker' ? location : undefined,
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
router.put('/profile', checkauth, upload.single('photo'), async (req, res) => {
    try {
        const { name, phone, profession, experience, location, chargeType, chargeAmount } = req.body;

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User Not found" });

        if (name) user.name = name;
        if (phone) user.phone = phone;

        if (user.role === 'worker') {
            if (profession) user.profession = profession;
            if (location) user.location = location;
            if (experience) user.experience = experience;
            if (chargeType) user.chargeType = chargeType;
            if (chargeAmount) user.chargeAmount = chargeAmount;
        }

        // If new photo upload then update
        if (req.file) {
            user.photo = `/uploads/${req.file.filename}`;
        }

        await user.save();
        res.json({ message: "Profile updated successfully!", user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});






// Check email exists or not — before OTP
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