const express = require('express');
const router = express.Router();
const sques = require('../models/Questions');
const jwt = require('jsonwebtoken'); 
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware'); 


//get all submitted questiona of a user 
router.get('/getsubQ', verifyToken, async (req, res) => {
    try {
        const UserName = req.username; 
        //console.log(UserName);
        const quiz = await sques.find({ submitby: UserName, status: "submit" });

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

router.get('/quizques',verifyToken,async(req,res)=>{
    try {
        const question=await sques.find().limit(15);
       return res.json(question);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
})

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




module.exports = router;





