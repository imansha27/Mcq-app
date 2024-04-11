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
        const quiz = await sques.find({ submitby: UserName }); 
        //console.log(quiz);
        res.status(200).json({ questions: quiz }); 
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});








//get all approved questions of a user
// router.get('/getAppQ', verifyToken, async (req, res) => {
//     try {
//         const UserName = req.username; 
//         const quiz = await aques.find({ submitby: UserName }); 

//         res.status(200).json({ questions: quiz }); 
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });








//pass questions for the quiz page

router.get('/quizques',verifyToken,async(req,res)=>{
    try {
        const question=await sques.find().limit(15);
       return res.json(question);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
})


module.exports = router;





