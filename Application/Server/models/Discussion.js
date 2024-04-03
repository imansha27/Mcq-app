const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
    },
    image: {
        filename: String,
        path: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


//get the amount of cmments in each discussion
DiscussionSchema.virtual('commentCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'discussion_id',
    count: true
});



module.exports = mongoose.model("Discussion", DiscussionSchema);
