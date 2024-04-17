const express =require('express');
const router =express.Router();
const results=require('../models/results');
const verifyToken= require('../middlewares/authMiddleware');
const QuizResult = require('../models/results');


//get all the question rounds
router.get('getrounds ',verifyToken,async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
})





//save a  the questions from a single round


router.post('/saveresults', verifyToken, async (req, res) => {
    console.log("receivinging...");
    const { answer } = req.body;
    console.log(answer);
    const userId = req.userId; // Corrected to req.userId
    try {
        const lastResult = await QuizResult.findOne({ UserId: userId }).sort({ createdAt: -1 }).limit(1); // Added await before QuizResult.findOne
        let roundNo = 1;

        if (lastResult) {
            roundNo = lastResult.roundNo + 1;
        }
        console.log(roundNo);

        const result = new QuizResult({ // Corrected to QuizResult instead of results
            UserId: userId,
            roundNo: roundNo,
            answers: answer
        });

        await result.save(); // Saving the result to the database

        res.status(200).json({ success: true, message: 'Results saved successfully.' });
    } catch (error) {
        console.error("Error saving results:", error);
        res.status(500).json({ success: false, message: 'Error saving results.' });
    }
});



module.exports = router;