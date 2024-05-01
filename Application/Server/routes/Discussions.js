const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const jwt = require('jsonwebtoken'); 
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware'); 



//submit new discussion
router.post('/newdiscuss', verifyToken, upload, async (req, res) => {
    try {
        const username = req.username;
        const { title, content } = req.body;

       

        if (!title || !content) {
            return res.status(400).json({ error: "Both Title and Content are required" });
        }

        const newdiscuss = new Discussion({
            title,
            content,
            author: username,
        });

        const existingdiscuss = await Discussion.findOne({ title });
        if (existingdiscuss) {
            return res.status(400).json({ error: "There's already a discussion with this title" });
        }
        await newdiscuss.save();
        return res.status(200).json({ success: "New Discussion started!" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
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




router.get('/selectdiscussion',verifyToken, async (req, res) => {
    try {
        const discussionId = req.query.discussionId;

       console.log(discussionId);
       const discuss = await Discussion.findOne({ discussionId });
       
       if (!discuss) {
          return res.status(404).json({ error: 'Discussion not found' });
       }
       
       return res.status(200).json({ discussion: discuss });
    } catch (error) {
       return res.status(500).json({ error: error.message });
    }
 });
 

module.exports = router;



