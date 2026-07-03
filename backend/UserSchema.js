const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true },
    password:     { type: String, required: true },
    phone:        { type: String, required: true },
    role:         { type: String, enum: ['client','worker','admin'], required: true },
    profession:   { type: String },
    experience:   { type: Number },
    photos:       [{ type: String }],
    extraDetails: { type: String },
    
    photo:        { type: String, default: '' },
    location:     { type: String, default: '' },
    rating:       { type: Number, default: 4.5 },
    jobsCompleted:{ type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);