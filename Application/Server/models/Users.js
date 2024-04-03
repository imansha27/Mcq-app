const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true,
        unique: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    School: {
        type: String,
        required: true
    },
    UserType: {
        type: String,
        enum: ['Student', 'Teacher'], 
        required: true
    },
    image: {
        filename: String,
        path: String
    },
    join_date: {
        type: Date,
        default: Date.now 
    }
}, {
    collection: "UserDetails" 
});

module.exports = mongoose.model("UserDetails", UserDetailsSchema);
