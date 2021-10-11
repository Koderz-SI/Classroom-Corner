const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    faculty: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
    },
    topic: {
        type: String,
    },
    pdffile: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('note', noteSchema);