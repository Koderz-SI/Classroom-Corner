const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    seller: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    buyer: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model('product', productSchema);