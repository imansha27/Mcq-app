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


router.post('saveresults',verifyToken,async(req,res)=>{
    const{answer}=req.body;
    console.log(answer)
    const UserId =req.UserId;
    try {
        const lastResult = await QuizResult.findOne({UserId:UserId}).sort({createdAt:-1}.limit(1));
        let roundNo=1;

        if(lastResult){
            roundNo=lastResult.roundNo+1;
        }
        console.log(roundNo);
        
        const round =new results({
           
            UserId:UserId ,
            roundNo:roundNo,
            answers:answer

        })
    } catch (error) {
        
    }
})