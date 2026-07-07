const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOtpEmail = async (toEmail, toName, otp) => {
    await transporter.sendMail({
        from: `"Skill Grid" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Your Skill Grid Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Hi ${toName || 'there'},</h2>
                <p>Your OTP for Skill Grid registration is:</p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `,
    });
};

module.exports = { sendOtpEmail };