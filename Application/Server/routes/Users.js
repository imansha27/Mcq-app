
const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

const multer = require('multer');
const upload = multer();


//user register
router.post('/register', upload.none(), async (req, res) => {
    try {
        let newUser = new Users(req.body);
        // console.log('Request Body:', req.body);

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

        // At this point, user authentication is successful
        // You can perform additional actions if needed, e.g., creating a session

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




module.exports = router;





