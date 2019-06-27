const mongoose = require('mongoose');

let CategorySchema = new mongoose.Schema({
    category_id: {
        type: Number,
        required: true
    },
    category_name: {
        type: String,
        required: true
    },
    category_child: {
        type: [Number]
    }
});

module.exports = mongoose.model('categories', CategorySchema);