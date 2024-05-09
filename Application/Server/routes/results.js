const express =require('express');
const router =express.Router();
//const results=require('../models/results');
const verifyToken= require('../middlewares/authMiddleware');
const QuizResult = require('../models/results');
const sques = require('../models/Questions');


//get all the question rounds
router.get('/getrounds', verifyToken, async (req, res) => {
    const userId = req.userId;
    const Result = await QuizResult.find({ UserId: userId });

    if (!Result) {
        return res.status(404).json({ error: 'Error fetching results' });
    }

    const updatedResult = Result.map(async (round) => {
        const updatedAnswers = await Promise.all(round.answers.map(async (answer) => {
            const question = await sques.findOne({ _id: answer.questionId });
            return {
                ...answer,
                category: question.Category,
                source:question.source,
                hint:question.hint,
                Correctans:question.Correctans,
                Question:question.Question,
                Choice1:question.Choice1,   
                Choice2:question.Choice2,
                Choice3:question.Choice3,
                Choice4:question.Choice4,
                Choice5:question.Choice5,
                unit:question.unit,
                submitby:question.submitby,
                difficulty:question.difficulty,
                prediction: question.prediction
            };
            
        }));
      
        return {
            roundNo: round.roundNo,
            answers: updatedAnswers
        };
    });

    res.json(await Promise.all(updatedResult));
   
});



//save a  the questions from a single round


// router.post('/saveresults', verifyToken, async (req, res) => {
//     console.log("receivinging...");
//     const { answer } = req.body;
//     //console.log(answer);
//     const userId = req.userId; 
//     try {
//         const lastResult = await QuizResult.findOne({ UserId: userId }).sort({ roundNo: -1 });


//         let roundNo = 1;

//         if (lastResult) {
//             roundNo = lastResult.roundNo + 1;
//         }
//         //console.log(roundNo);

//         const result = new QuizResult({
//             UserId: userId,
//             roundNo: roundNo,
//             answers: answer
//         });

//         await result.save(); 

//         res.status(200).json({ success: true, message: 'Results saved successfully.' });
//     } catch (error) {
//         console.error("Error saving results:", error);
//         res.status(500).json({ success: false, message: 'Error saving results.' });
//     }
// });

const { spawn } = require('child_process');



router.post('/saveresults', verifyToken, async (req, res) => {
    console.log("receiving... to retrain");
    const { answer } = req.body;
    const userId = req.userId; 
    try {
        const lastResult = await QuizResult.findOne({ UserId: userId }).sort({ roundNo: -1 });
        let roundNo = 1;

        if (lastResult) {
            roundNo = lastResult.roundNo + 1;
        }

        const result = new QuizResult({
            UserId: userId,
            roundNo: roundNo,
            answers: answer
        });

        // Save result to the database
        await result.save();
        const keywordsToString = (keywords) => {
            if (Array.isArray(keywords)) {
                return keywords.map(keyword => keyword.replace(/\r/g, '')).join(',');
            }
            return '';
        };
        // Extract relevant information from the answer object after saving to the database
        const extractedData = await Promise.all(answers.map(async (ans) => {
            const question = await sques.findOne({ _id: ans.questionId });
            return {
                Student_ID: userId,
                Round: roundNo,
                Category:question.Category,
                Difficulty_Level: question.difficulty,
                Correctness:ans.Correctness,
                keywords:  keywordsToString(question.keywords),
            };
        }));
        
        console.log(extractedData);

        // Pass extracted data to retrain.py using child process
        const pythonProcess = spawn('python', ['retrain.py', JSON.stringify(extractedData)]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`retrain.py output: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error from retrain.py: ${data}`);
        });

        res.status(200).json({ success: true, message: 'Results saved successfully.' });
    } catch (error) {
        console.error("Error saving results:", error);
        res.status(500).json({ success: false, message: 'Error saving results.' });
    }
});


module.exports = router;