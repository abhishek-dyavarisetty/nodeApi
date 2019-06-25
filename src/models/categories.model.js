const mongoose = require('mongoose');

let CategorySchema = new mongoose.Schema({
    category_id: Number,
    category_name: String,
    category_child: [Number]
});

module.exports = mongoose.model('categories', CategorySchema);