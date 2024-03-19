const express = require('express');
const router = express.Router();
const sques = require('../models/SubQuestions');
const multer = require('multer');
const upload = multer();


//submit new question
router.post('/submitques', upload.none(), async (req, res) => {
    try {
        // Retrieve the username from the session
        const Username = req.session.username;
        console.log(req.session)
       
        console.log('Username set in session:', req.session.username);

        
        // Check if username exists in the session
        if (!Username) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // Create a new question object
        const newQues = new sques(req.body);
        
        // Set the submitby field to the username from the session
        newQues.submitby = Username;

        // Check if the question already exists
        const existingQuestion = await sques.findOne({ Question: req.body.Question });
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
