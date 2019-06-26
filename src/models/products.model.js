const mongoose = require('mongoose');

// let productCategorySchema = new mongoose.Schema({
//   category_id: Number
// });

let productCategorySchema = new mongoose.Schema({
  
})

let ProductSchema = new mongoose.Schema({
    product_id: {
      type: Number,
      required: true
    },
    product_name: {
      type: String,
      required: true
    },
    product_price: Number,
    product_category: {
    type: [Number],
    },
  })

module.exports = mongoose.model('products', ProductSchema);
