const express = require('express');
const router = express.Router();
const sques = require('../models/SubQuestions');
const jwt = require('jsonwebtoken'); 
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware'); // Require file upload middleware

// submit new question
router.post('/submitques', verifyToken, upload, async (req, res) => {
    try {
      
        const username = req.username;

       
        const { Question, Choice1, Choice2, Choice3, Choice4, Choice5, Correctans, Category, source } = req.body;
        
        //  image file exists
        let image = null;
        if (req.file) {
            image = {
                filename: req.file.filename,
                path: req.file.path 
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
            image, 
            submitby: username,
        });
     

     
        const existingQuestion = await sques.findOne({ Question });
        if (existingQuestion) {
            return res.status(400).json({ error: "Question already exists" });
        }

       
        await newQues.save();
        
  
        return res.status(200).json({ success: "Question submitted successfully" });
    } catch (error) {
       
        return res.status(400).json({ error: error.message });
    }
});








//pass questions for the quiz page

router.get('/quizques',verifyToken,async(req,res)=>{
    try {
        const question=await sques.find().limit(15);
        res.json(question);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})






module.exports = router;
