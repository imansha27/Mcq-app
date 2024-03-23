const express = require('express');
const router = express.Router();
const sques = require('../models/SubQuestions');
const multer = require('multer');
const upload = multer();
const jwt = require('jsonwebtoken'); 
const verifyToken = require('../middlewares/authMiddleware');

// submit new question
router.post('/submitques', verifyToken, upload.single('image'), async (req, res) => {
    try {
        // Retrieve the username from the request object
        const username = req.username;

        // Check if all required fields are provided
        const { Question, Choice1, Choice2, Choice3, Choice4, Choice5, Correctans, Category, source } = req.body;
        if (!Question || !Choice1 || !Choice2 || !Choice3 || !Choice4 || !Choice5 || !Correctans || !Category || !source) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if an image was provided
        let imagePath = null;
        if (req.file) {
            // If an image was provided, save its path
            imagePath = req.file.path;
        }

        // Create a new question object
        const newQues = new sques({
            Question,
            Choice1,
            Choice2,
            Choice3,
            Choice4,
            Choice5,
            Correctans,
            Category,
            source,
            submitby: username, // Set the submitby field to the username
            image: imagePath // Set the image path
        });

        // Check if the question already exists
        const existingQuestion = await sques.findOne({ Question });
        if (existingQuestion) {
            return res.status(400).json({ error: "Question already exists" });
        }

        // Save the new question to the database
        await newQues.save();
        
        // Send success response
        res.status(200).json({ success: "Question submitted successfully" });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
