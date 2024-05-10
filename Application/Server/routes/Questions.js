const express = require('express');
const router = express.Router();
const sques = require('../models/Questions');
const jwt = require('jsonwebtoken'); 
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware');
const { exec } = require('child_process'); 

const pythonScriptPath = './keyword_extraction.py';


function extractKeywordsPythonScript(data, callback) {
    exec(`python ${pythonScriptPath} "${data}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            return callback(error, null);
        }
        if (stderr) {
            console.error(`Python script stderr: ${stderr}`);
            return callback(new Error(stderr), null);
        }
        // Extracted keywords 
        const keywords = stdout.trim().split('\n');
        callback(null, keywords);
    });
}


router.post('/submitques', verifyToken, upload, async (req, res) => {
    try {
        const username = req.username;
        const { Question, Choice1, Choice2, Choice3, Choice4, Choice5, Correctans,difficulty,Category, source,hint,unit } = req.body;
        //console.log(req.body);
        let image = null;
        if (req.file) {
            image = {
                filename: req.file.filename,
                path: req.file.path 
            };
        }

        if (!Question || !Choice1 || !Choice2 || !Choice3 || !Choice4 || !Choice5 || !Correctans || !Category || !source ||!difficulty||!hint||!unit) {
            return res.status(400).json({ error: "All fields are required." });
        } 

       
             // Concatenate question and choices into a single string
             const dataForExtraction = `${Question} ${Choice1} ${Choice2} ${Choice3} ${Choice4} ${Choice5}`;

             // Extract keywords from the question and choices using Python script
             const keywords = await new Promise((resolve, reject) => {
                 extractKeywordsPythonScript(dataForExtraction, (error, keywords) => {
                     if (error) {
                         console.error(`Error extracting keywords: ${error.message}`);
                         reject("Keyword extraction failed");
                     } else {
                         resolve(keywords);
                     }
                 });
             });
     
             // Keywords extracted successfully, proceed with saving the question
             const existingQuestion = await sques.findOne({ Question });
             if (existingQuestion) {
                 return res.status(400).json({ error: "Question already exists" });
             }

        const newQues = new sques({
            Question,
            Choice1,
            Choice2,
            Choice3,
            Choice4,
            Choice5,
            Correctans,
            difficulty,
            Category,
            source,
            unit,
            hint,
            image, 
            submitby: username,
            keywords: keywords 
        });

        await newQues.save();
        return res.status(200).json({ success: "Question submitted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;
