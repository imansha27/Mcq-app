const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');
const jwt = require('jsonwebtoken'); 
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware'); 
const Discussion = require('../models/Discussion');


router.post('/savecomment', verifyToken, async (req, res) => {
    try {
        // Retrieve data from request body
        const { content, discussion_id } = req.body;
        const author = req.username; 
        
        // Create a new Comment instance
        const newComment = new Comment({
            content,
            author,
            discussion_id
        });

        // Save the comment to the database
        const savedComment = await newComment.save();

        res.status(201).json({ message: "Comment saved successfully", comment: savedComment });
    } catch (error) {
        console.error("Error saving comment:", error);
        res.status(500).json({ error: "Failed to save comment" });
    }
});




router.get('/getcomments', verifyToken, async (req, res) => {
    try {
        const discussionId = req.query.discussionId; 
        
       
        const comments = await Comment.find({ discussion_id: discussionId });
        console.log("Comments:", comments); 
        
        return res.status(200).json(comments);
    } catch (error) {
        console.error("Error:", error); 
        return res.status(500).json({ error: error.message });
    }
});




module.exports = router;