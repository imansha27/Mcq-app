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
    UserType: {
        type: String,
        enum: ['Student', 'Teacher'], 
        required: true
    },
    image: {
        type: String,
        
    },
}, {
    collection: "UserDetails" 
});

module.exports = mongoose.model("UserDetails", UserDetailsSchema);
