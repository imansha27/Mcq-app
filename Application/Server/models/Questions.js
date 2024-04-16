const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    Question: {
        type: String,
        required: true
    },
    Choice1: {
        type: String,
        required: true
    },
    Choice2: {
        type: String,
        required: true
    },
    Choice3: {
        type: String,
        required: true
    },
    Choice4: {
        type: String,
        required: true
    },
    Choice5: {
        type: String,
        required: true
    },
    Correctans: {
        type: String,
        enum: ['Choice1', 'Choice2', 'Choice3', 'Choice4', 'Choice5'],
        required: true
    },
    Category: {
        type: String,
        enum: ['Organic', 'Inorganic', 'Physical'],
        required: true
    },
    source: {
        type: String,
        required: true
    }, 
     hint: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        enum: ['Unit 01 Atomic structure', 'Unit 02 Structure and bonding', 'Unit 03 Chemical calculations', 'Unit 04 Gaseous state of matter', 'Unit 05 Energetics', 'Unit 06 Chemistry of s,p and d block elements', 'Unit 07 Basic concepts of organic chemistry', 'Unit 08 Hydrocarbons and halohydrocarbons', 'Unit 09 Oxygen containing organic compounds', 'Unit 10 Nitrogen containing organic compounds', 'Unit 11 Chemical kinetics', 'Unit 12 Equilibrium', 'Unit 13 Electro chemistry', 'Unit 14 Industrial chemistry and Environmental pollution'],
        required: true
    },
    submitby: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'submit' 
    },
    image: {
        filename: String,
        path: String
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    keywords: {
        type: [String],
        required:true 
    }
}, {
    collection: "quesDetails"
});

module.exports = mongoose.model("quesDetails", QuestionSchema);
