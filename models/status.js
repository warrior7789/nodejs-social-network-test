// status.js (create a new file for status schema)
const mongoose = require('mongoose');
const statusSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    content: {
        type: String,
        default: ""
    },
    attachment: {
        type: String,
        default: ""
    },
    attachmenttype: {
        type: String,
        default: ""
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }, ],
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
    }, ],
}, {
    timestamps: true
});

const Status = mongoose.model('status', statusSchema);
module.exports = Status;