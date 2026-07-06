const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    client:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    worker:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceNeeded: { type: String, required: true },
    address:       { type: String, required: true },
    date:          { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    },
    clientMessage: { type: String },
    completionOtp: { type: String },   // ← NEW: 4-digit OTP
    isCompleted:   { type: Boolean, default: false } // ← NEW
}, { timestamps: true });

module.exports = mongoose.model('request', RequestSchema);