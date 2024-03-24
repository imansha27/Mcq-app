const express = require('express');
const router = express.Router();
const sques = require('../models/SubQuestions');
const jwt = require('jsonwebtoken'); 
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware'); // Require file upload middleware

// submit new question
router.post('/submitques', verifyToken, upload, async (req, res) => {
    try {
        // Retrieve the username from the request object
        const username = req.username;

        // Check if all required fields are provided
        const { Question, Choice1, Choice2, Choice3, Choice4, Choice5, Correctans, Category, source } = req.body;
        
        // Check if the image file exists
        let image = null;
        if (req.file) {
            image = {
                filename: req.file.filename,
                path: req.file.path // or whatever property holds the path to the uploaded file
            };
        }

        if (!Question || !Choice1 || !Choice2 || !Choice3 || !Choice4 || !Choice5 || !Correctans || !Category || !source ) {
            return res.status(400).json({ error: "All fields are required including image." });
        } 

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
            image, // Assign the image object
            submitby: username, // Set the submitby field to the username
        });
        //console.log(newQues.image.path);

        // Check if the question already exists
        const existingQuestion = await sques.findOne({ Question });
        if (existingQuestion) {
            return res.status(400).json({ error: "Question already exists" });
        }

        // Save the new question to the database
        await newQues.save();
        
        // Send success response
        return res.status(200).json({ success: "Question submitted successfully" });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;
