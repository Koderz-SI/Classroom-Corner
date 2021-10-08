const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    exp: {
        type: String,
    },
    qualification: {
        type: String,
    },
    awards: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    isPending: {
        type: Boolean,
        default: true,
      },
});

module.exports = mongoose.model('faculty', facultySchema);