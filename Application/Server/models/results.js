const mongoose = require('mongoose');

const quizresultSchema =new mongoose.Schema({
    roundNo:{
        type:Number,
        requires:true
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    answers:[{
    questionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'AppQuestion',
        required:true
    },
    questionNo:{
        type:String,
        required:true
    },
    givenanswer:{
        type:String,
        required:true
    },
    answeredCorrectly:{
        type:Boolean,
        required:true
    },
    time:{
        type:Number,
        required:true
    }
}]
});

const QuizResult =mongoose.model('QuizResult',quizresultSchema);

module.exports = QuizResult;