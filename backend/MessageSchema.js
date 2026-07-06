const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    requestId:  { type: mongoose.Schema.Types.ObjectId, ref: 'request', required: true },
    senderId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    message:    { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);