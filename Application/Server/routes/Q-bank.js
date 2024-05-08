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
router.get('/getAppQ', verifyToken, async (req, res) => {
    try {
        const UserName = req.username; 
        const quiz = await sques.find({ submitby: UserName, status: "approve" });

        res.status(200).json({ questions: quiz }); 
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



router.get('/quizques', verifyToken, async (req, res) => {
    try {
       
        const userId = req.userId;
        console.log("User ID:", userId);

        const lastResult = await QuizResult.findOne({ UserId: userId }).sort({ roundNo: -1 });

        console.log("Last Result:", lastResult);

      
        let roundNo = 1;

        if (lastResult) {
            roundNo = lastResult.roundNo + 1;
        }
        console.log("Round Number:", roundNo);

    
        const inorganicQuestions = await sques.aggregate([
            { $match: { Category: "Inorganic", status: "approve" } },
            { $sample: { size: 3 } }
        ]);
        console.log("Inorganic Questions:", inorganicQuestions);

  
        const organicQuestions = await sques.aggregate([
            { $match: { Category: "Organic", status: "approve" } },
            { $sample: { size: 3 } }
        ]);
        console.log("Organic Questions:", organicQuestions);

     
        const physicalQuestions = await sques.aggregate([
            { $match: { Category: "Physical", status: "approve" } },
            { $sample: { size: 3 } }
        ]);
        console.log("Physical Questions:", physicalQuestions);

        const questions = [
            ...inorganicQuestions,
            ...organicQuestions,
            ...physicalQuestions
        ];

        questions.sort(() => Math.random() - 0.5);

        // Return questions and round number
        return res.json({ questions, roundNo });
        //return res.json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        return res.status(500).json({ message: "Error fetching questions" });
    }
});














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





