const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    starttime: {
        type: String,
    },
    endtime: {
        type: String,
    },
    duration: {
        type: String,
    },
});

module.exports = mongoose.model('quiz', quizSchema);