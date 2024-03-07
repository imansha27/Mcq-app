const express =require('express');
const mongoose =require('mongoose');

const app =express();

const PORT =8000;
const DB_URL='mongodb+srv://pkkimansha27:Daylight@mcq.to7wdjo.mongodb.net/'

mongoose.connect(DB_URL)
.then(()=>{
    console.log('DB connected');
})
.catch((err)=>console.log('DB connection error',err));



app.listen(PORT,() =>{
    console.log('App is running on port 8000');
});


