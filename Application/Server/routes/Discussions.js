const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const jwt = require('jsonwebtoken'); 
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware'); 



//submit new discussion

router.post('/newdiscuss',verifyToken,upload,async(req,res)=>{
    try{
        const username =req.username;

        const{title,content}=req.body;

        let image=null;
        if(req.file){
            image={
                filename:req.files.filename,
                path:req.file.path
            };
        }
        if (!title||!content){
            return res.status(400).json({error:"Both Title and Content are required"});
        }

        const newdiscuss=new Discussion({
            title,
            content,
            image,
            author:username,
        });

        const existingdiscuss = await Discussion.findOne({title});
        if(existingdiscuss){
            return res.status(400).json({error:"There's a;ready a discussion with this title"});
        }
        await newdiscuss.save();
        return res.status(200).json({success:"New Discussion started!"});


    }catch(error){
        return res.status(400).json({error:error.message});
    }
})



//get all the discussion threads

router.get('/discussions',async(req,res)=>{
    try{
     const discussions=await Discussion.find();
     return res.status(200).json(discussions);
    }catch(error){
      return res.status(500).json({error:error.message});
    }
});

module.exports = router;



