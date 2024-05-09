
const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;




//user register
router.post('/register', upload.none(), async (req, res) => {
    try {
        const {FirstName,LastName,Email,UserType, UserName, Password } = req.body;

        // Encrypt the password
        const encryptedPassword = await bcrypt.hash(Password, 10);

        // Check if username already exists
        const existingUser = await Users.findOne({ UserName: UserName });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        let newUser = new Users({
            FirstName:FirstName,
            LastName:LastName,
            Email:Email,
            UserType:UserType,
            UserName: UserName,
            Password: encryptedPassword,
            
        });

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





//login user
router.post('/login', async (req, res) => {
    try {
        const { username, password, userType } = req.body;
        
        // Find the user by username
        const user = await Users.findOne({ UserName: username });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        // Compare the user type
        if (userType !== user.UserType) {
            return res.status(401).json({ error: 'Invalid user type.' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username: user.UserName,userType: user.UserType }, JWT_SECRET);
       // console.log(token);

        // Send the token to the frontend along with the response
        if (user.UserType === 'Student') {
            return res.json({ success: 'Login successful. Redirecting to s-home', redirect: '/Application/Client_side/s-index.html', token });
        } else if (user.UserType === 'Teacher') {
            return res.json({ success: 'Login successful. Redirecting to t-home', redirect: '/Application/Client_side/t-home.html', token });
        } else {
            return res.status(400).json({ error: 'Invalid user type.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


//get user details to the profile page

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ data: user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






// edit user details   

router.put('/edit-profile', verifyToken, upload.single('image'), async (req, res) => {
    try {
        console.log("started................");
        const userId = req.userId;
        const { Email, School } = req.body; 
        console.log(req.body);
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Update user details
        user.Email = Email;
        user.School = School;

        // Check if theres a image 
        if (req.file) {
            user.image = req.file.path; 
        }

        await user.save();

        res.json({ success: 'User details updated successfully.' });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});













module.exports = router;





