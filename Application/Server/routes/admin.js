const express = require('express');
const router = express.Router();
const admin = require('../models/admin');
const sques = require('../models/Questions');
const Users = require('../models/Users');



//admin login
router.post('/alogin', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);

        const auser = await admin.findOne({ username: username });
        if (!auser) {
            return res.status(401).json({ error: 'Invalid Username' });
        }

       
        if (password !== auser.password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        return res.status(200).json({ success: "Login Successful" });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




//get all submited questions

router.get('/adminsubQ', async (req, res) => {
    try {
         
       
        const quiz = await sques.find({ status: "submit" });

        //console.log(quiz);
        res.status(200).json({ questions: quiz }); 
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});




//get all approved questions
router.get('/adminAppQ',async (req, res) => {
    try {
      
        const quiz = await sques.find({status: "approve" });

        res.status(200).json({ questions: quiz }); 
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});





//remove questions from the QBank
router.post('/removeAQ', async (req, res) => {
    const { question_id } = req.body;
    try {
       
        const updatedQuestion = await sques.findByIdAndUpdate(question_id, { status: "submit" }, { new: true });
        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.status(200).json({ message: "Question status updated successfully", updatedQuestion });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



//approve questions to the QBank
router.post('/approveQ', async (req, res) => {
    //console.log(req.body)
    const { question_id } = req.body;
    try {
       
        const updatedQuestion = await sques.findByIdAndUpdate(question_id, { status: "approve" }, { new: true });
        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.status(200).json({ message: "Question status updated successfully", updatedQuestion });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



//get all the users 

router.get('/adminusers',async (req, res) => {
    try {
      
        const user=await Users.find();
        res.status(200).json(user);
        

       
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

//delete a specific user 

router.delete('/delusers',async(req,res)=>{
    const { user_id } = req.body;
    
    try{
        const deleU = await Users.findByIdAndDelete(user_id);
        if(!deleU){
            return res.status(404).json({error:"The user dosen't exsist"});
        }
        //console.log(deleS);
        res.json({message:"User Deleted Successfully!"});
    } catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
})


module.exports = router;