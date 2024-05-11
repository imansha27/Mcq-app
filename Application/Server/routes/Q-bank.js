const express = require('express');
const router = express.Router();
const sques = require('../models/Questions');
const jwt = require('jsonwebtoken'); 
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware'); 
const QuizResult = require('../models/results');





//get all submitted questiona of a user 
router.get('/getsubQ', verifyToken, async (req, res) => {
    try {
        const UserName = req.username; 
        //console.log(UserName);
        const quiz = await sques.find({ submitby: UserName, status: { $in: ["submit", "reject"] } });

        //console.log(quiz);
        res.status(200).json({ questions: quiz }); 
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});









//delete a submitted question 
router.delete('/delesubQ',verifyToken,async(req,res)=>{
    const { question_id } = req.body;
    try{
        const deleS = await sques.findByIdAndDelete(question_id);
        if(!deleS){
            return res.status(404).json({error:"The question dosen't exsist"});
        }
        //console.log(deleS);
        res.json({message:"Question Deleted Successfully!"});
    } catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
});








//get all approved questions of a user
// router.get('/getAppQ', verifyToken, async (req, res) => {
//     try {
//         const UserName = req.username; 
//         const quiz = await sques.find({ submitby: UserName, status: "approve" });

//         res.status(200).json({ questions: quiz }); 
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });
router.get('/getAppQ', verifyToken, async (req, res) => {
    try {
        const UserName = req.username;

        // Fetch approved questions for the user
        const approvedQuestions = await sques.find({ submitby: UserName, status: "approve" });
        const questionIds = approvedQuestions.map(question => question._id.toString());

        // Fetch all quiz results
        const allQuizResults = await QuizResult.find();

        // Initialize question appearance count and correct count objects
        const questionAppearanceCount = {};
        const questionCorrectCount = {};

        // Count how many times each approved question appears in quiz results
        allQuizResults.forEach(quizResult => {
            quizResult.answers.forEach(answer => {
                const stringQuestionId = answer.questionId.toString(); // Convert ObjectId to string

                if (questionIds.includes(stringQuestionId)) {
                    // Increment appearance count for the question
                    questionAppearanceCount[stringQuestionId] = (questionAppearanceCount[stringQuestionId] || 0) + 1;

                    // Increment correct count if the answer is correct
                    if (answer.answeredCorrectly) {
                        questionCorrectCount[stringQuestionId] = (questionCorrectCount[stringQuestionId] || 0) + 1;
                    }
                }
            });
        });

        // Calculate incorrect count for each question
        const questionIncorrectCount = {};
        Object.keys(questionAppearanceCount).forEach(questionId => {
            const appearanceCount = questionAppearanceCount[questionId];
            const correctCount = questionCorrectCount[questionId] || 0;
            const incorrectCount = appearanceCount - correctCount;
            questionIncorrectCount[questionId] = incorrectCount;
        });

        // Combine question counts with approved questions
        const questionsWithCounts = approvedQuestions.map(question => ({
            ...question.toObject(),
            appearanceCount: questionAppearanceCount[question._id.toString()] || 0,
            correctCount: questionCorrectCount[question._id.toString()] || 0,
            incorrectCount: questionIncorrectCount[question._id.toString()] || 0
        }));
        console.log(questionsWithCounts);
        res.status(200).json({ questions: questionsWithCounts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});









//delete a approved question 

router.delete('/deleappQ',async(req,res)=>{
    const { question_id } = req.body;
    try{
        const deleQ = await sques.findByIdAndDelete(question_id);
        if(!deleQ){
            return res.status(404).json({error:"The user dosen't exsist"});
        }
        //console.log(deleS);
        res.json({message:"User Deleted Successfully!"});
    } catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
})




//pass questions for the quiz page

// router.get('/quizques',verifyToken,async(req,res)=>{
//     try {
//         const question=await sques.find().limit(9);
//        return res.json(question);
//     } catch (error) {
//         return res.status(500).json({message:error.message});
//     }
// })




// router.get('/quizques', verifyToken, async (req, res) => {
//     try {
        
        
//         const inorganicQuestions = await sques.aggregate([
//             { $match: { Category: "Inorganic", status: "approve" } },
//             { $sample: { size: 3 } }
//         ]);

//         const organicQuestions = await sques.aggregate([
//             { $match: { Category: "Organic", status: "approve" } },
//             { $sample: { size: 3 } }
//         ]);

//         const physicalQuestions = await sques.aggregate([
//             { $match: { Category: "Physical", status: "approve" } },
//             { $sample: { size: 3 } }
//         ]);

//         // Combine the questions 
//         const questions = [
//             ...inorganicQuestions,
//             ...organicQuestions,
//             ...physicalQuestions
//         ];

//         // Shuffle the  questions array to randomize the order
       
//         questions.sort(() => Math.random() - 0.5);

//         return res.json(questions);
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });



////////////////////////////////////////////////////

const { spawn } = require('child_process');

router.get('/quizques', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
       

        const lastResult = await QuizResult.findOne({ UserId: userId }).sort({ roundNo: -1 });
        

        let roundNo = 1;
        if (lastResult) {
            roundNo = lastResult.roundNo + 1;
        }
      

        const inorganicQuestions = await sques.aggregate([
            { $match: { Category: "Inorganic", status: "approve" } },
            { $sample: { size: 3 } }
        ]);
       

        const organicQuestions = await sques.aggregate([
            { $match: { Category: "Organic", status: "approve" } },
            { $sample: { size: 3 } }
        ]);
      

        const physicalQuestions = await sques.aggregate([
            { $match: { Category: "Physical", status: "approve" } },
            { $sample: { size: 3 } }
        ]);
     
        const questions = [
            ...inorganicQuestions,
            ...organicQuestions,
            ...physicalQuestions
        ];

        questions.sort(() => Math.random() - 0.5);
        
        const keywordsToString = (keywords) => {
            if (Array.isArray(keywords)) {
                return keywords.map(keyword => keyword.replace(/\r/g, '')).join(',');
            }
            return '';
        };
        
        // Prepare data to send to Python script
        const newData = {
            Student_ID: questions.map(question => question._id),
            Round: questions.map(() => roundNo),
            Category: questions.map(question => question.Category),
            Difficulty_Level: questions.map(question => question.difficulty),
            Keywords: questions.map(question => keywordsToString(question.keywords))
        };
        //console.log("Data to send to Python script:", newData);
      
        // Call Python script
        const pythonProcess = spawn('python', ['./predict.py']); 


        pythonProcess.stdin.write(JSON.stringify(newData));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            const predictions = JSON.parse(data.toString());
            //console.log("Predictions:", predictions);

            // Return questions, round number, and predictions
            return res.json({ questions, roundNo, predictions });
        });

        pythonProcess.stderr.on('data', (data) => {
            //console.error(`Error from Python script: ${data}`);
            return res.status(500).json({ message: "Error executing Python script" });
        });

    } catch (error) {
        console.error("Error fetching questions:", error);
        return res.status(500).json({ message: "Error fetching questions" });
    }
});































// router.get('/quizques', verifyToken, async (req, res) => {
//     try {
       
//         const userId = req.userId;
//         console.log("User ID:", userId);

//         const lastResult = await QuizResult.findOne({ UserId: userId }).sort({ roundNo: -1 });

//         console.log("Last Result:", lastResult);

      
//         let roundNo = 1;

//         if (lastResult) {
//             roundNo = lastResult.roundNo + 1;
//         }
//         console.log("Round Number:", roundNo);

    
//         const inorganicQuestions = await sques.aggregate([
//             { $match: { Category: "Inorganic", status: "approve" } },
//             { $sample: { size: 3 } }
//         ]);
//         console.log("Inorganic Questions:", inorganicQuestions);

  
//         const organicQuestions = await sques.aggregate([
//             { $match: { Category: "Organic", status: "approve" } },
//             { $sample: { size: 3 } }
//         ]);
//         console.log("Organic Questions:", organicQuestions);

     
//         const physicalQuestions = await sques.aggregate([
//             { $match: { Category: "Physical", status: "approve" } },
//             { $sample: { size: 3 } }
//         ]);
//         console.log("Physical Questions:", physicalQuestions);

//         const questions = [
//             ...inorganicQuestions,
//             ...organicQuestions,
//             ...physicalQuestions
//         ];

//         questions.sort(() => Math.random() - 0.5);

//         // Return questions and round number
//         return res.json({ questions, roundNo });
//         //return res.json(questions);
//     } catch (error) {
//         console.error("Error fetching questions:", error);
//         return res.status(500).json({ message: "Error fetching questions" });
//     }
// });














//edit submited questions

router.post('/editsubQ', verifyToken,async(req,res)=>{
    const updatedQuestionData=req.body;
    const{_id,...update}=updatedQuestionData;
try{
const updatedQuestion =await sques.findByIdAndUpdate(_id,update,{new:true});

if(!updatedQuestion){
    return res.status(404).json({error:"There no similar question"})
}

res.json({message:"Question updated successfully",updatedQuestion});
}catch(error){
    console.error("Error updating the question",error);
    res.status(500).json({message:"Internal Server Error"});
}
});









//delete submitted question
router.delete('/delesubQ',async(req,res)=>{
    const { question_id } = req.body;
    try{
        const deleQ = await sques.findByIdAndDelete(question_id);
        if(!deleQ){
            return res.status(404).json({error:"The user dosen't exsist"});
        }
        //console.log(deleS);
        res.json({message:"User Deleted Successfully!"});
    } catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
})



//get a question by its id 
router.get('/getquestion',async(req,res)=>{
    const { question_id } = req.body;
    const Qus = await sques.find(question_id);

    if(!Qus){
        return res.status(404).json({error:'Question not found'})
    }
    res.json(Qus);
});


router.get('/practice', async (req, res) => {
    try {
      const category = req.query.category; // Extract category from query parameter
      //console.log("Category:", category);
      let matchQuery = { status: "approve" };
      if (category !== "All") {
        matchQuery.Category = category;
      }
      const questions = await sques.aggregate([
        { $match: matchQuery },
        { $sample: { size: 9 } }
      ]);
  
      res.json({ questions });
    } catch (error) {
      console.error("Error fetching practice questions:", error);
      return res.status(500).json({ message: "Error fetching practice questions" });
    }
  });



module.exports = router;





