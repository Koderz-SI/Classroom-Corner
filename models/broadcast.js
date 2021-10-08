const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
    faculty: {
        type: String,
        required: true,
    },
    msg: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('broadcast', broadcastSchema);