
const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const multer = require('multer');
const upload = multer();
const session = require('express-session');

//user register
router.post('/register', upload.none(), async (req, res) => {
    try {
        const { UserName } = req.body;


        // Check if username already exists
        const existingUser = await Users.findOne({ UserName: UserName });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        let newUser = new Users(req.body);
        await newUser.save();
        res.status(200).json({
            success: "User registered successfully",
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});





//user login

router.post('/login', async (req, res) => {
    try {
        const { username, password, userType } = req.body;
        

        // Find the user by username and password
        const user = await Users.findOne({ UserName: username, Password: password, UserType: userType });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username, password, or user type.' });
        }

        req.session.username = username;
        console.log(req.session)
       
        console.log('Username received in login:', username);

       


        // Redirect based on user type
        if (userType === 'Student') {
            res.json({ success: 'Login successful. Redirecting to s-home', redirect: '/Application/Client_side/s-home.html' });
        } else if (userType === 'Teacher') {
            res.json({ success: 'Login successful. Redirecting to t-home', redirect: '/Application/Client_side/t-home.html' });
        } else {
            res.status(400).json({ error: 'Invalid user type.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//get userdetails to user profile
router.get('/profile', async (req, res) => {
    try {
        const username = req.session.username;
        if (!username) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const user = await Users.findOne({ UserName: username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;





