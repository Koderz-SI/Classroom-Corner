const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    idcheck: {
        type: String,
        required: true,
    },
    ques: {
        type: String,
        required: true,
    },
    opt1: {
        type: String,
        required: true,
    },
    opt2: {
        type: String,
        required: true,
    },
    opt3: {
        type: String,
        required: true,
    },
    opt4: {
        type: String,
        required: true,
    },
    correct: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('question', questionSchema);