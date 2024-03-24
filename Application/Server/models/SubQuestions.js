const mongoose = require('mongoose');

const SubmitedQSchema = new mongoose.Schema({
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
    submitby: {
        type: String,
        required: true
    },
    image: {
        filename: String,
        path: String
    }
}, {
    collection: "SquesDetails"
});

module.exports = mongoose.model("SquesDetails", SubmitedQSchema);
