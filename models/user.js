const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const UserSchema = mongoose.Schema({
    fullname       : { type: String,default: null},    
    email          : { type: String,default: null,index:true},
    password       : { type: String,default: null},    
    profilePicture: {
        type: String,
        default: "default-profile-picture.jpg", // You can set a default profile picture file path or URL
    },
    coverPicture: {
        type: String,
        default: "default-cover-picture.jpg", // You can set a default cover picture file path or URL
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }], 
    statuses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'status',
    }],

}, {
    timestamps: true
});

// Hash the plain text password before saving
UserSchema.pre('save', async function (next) {
    const user = this 
    if (user.isModified('password')) {
        console.log("changind password")
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
module.exports = mongoose.model('user', UserSchema);