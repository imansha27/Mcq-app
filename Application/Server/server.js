const express =require('express');
const mongoose =require('mongoose');
const bodyParser =require('body-parser');
const connectToDatabase = require('./database/connection');
const cors = require('cors');



const app =express();

app.use(cors());
app.use('/Client_side', express.static('Client_side'));
app.use('/Admin_side', express.static('Admin_side'));

//import routes
const UserRoutes=require('./routes/Users');

app.use(bodyParser.json());
app.use(express.json());

app.use(UserRoutes);

const PORT =8000;
connectToDatabase();

app.listen(PORT,() =>{
    console.log('App is running on port 8000');
});


