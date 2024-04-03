// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectToDatabase = require('./database/connection');
const cors = require('cors');


// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());





// Static file serving
app.use('/Client_side', express.static('Client_side'));
app.use('/Admin_side', express.static('Admin_side'));

// Import routes
const UserRoutes = require('./routes/Users');
const QuesRoutes = require('./routes/Questions');
const DiscusRoutes = require('./routes/Discussions');
const commentsRoutes = require('./routes/comments');


// Routes
app.use(UserRoutes);
app.use(QuesRoutes);
app.use(DiscusRoutes);
app.use(commentsRoutes);

// Connect to database
connectToDatabase();

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
    console.log('App is running on port 8000');
});
