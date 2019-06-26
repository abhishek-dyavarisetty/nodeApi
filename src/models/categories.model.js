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
        type: [Number],
        // validate: {
        //     validator: (validation, cb) => {
        //         categories.find({category_id: {$all: validation}}, () => {
        //             cb(docs.length == 0);
        //         });
        //     },
        //     message: 'category already exists!'
        // }
    }
});

module.exports = mongoose.model('categories', CategorySchema);