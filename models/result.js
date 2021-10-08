const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    student: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    correctans: {
        type: String,
    },
    wrongans: {
        type: String,
    },
});

module.exports = mongoose.model('result', resultSchema);