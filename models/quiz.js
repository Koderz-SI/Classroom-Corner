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
    startdate: {
        type: Date,
        default: Date.now,
    },
    enddate: {
        type: Date,
    }
});

module.exports = mongoose.model('quiz', quizSchema);