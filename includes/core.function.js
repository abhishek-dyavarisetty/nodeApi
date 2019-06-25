const ProductModel = require('../src/models/products.model');
const CategoryModel = require('../src/models/categories.model');

let categoryValidation = (categoriesIds) => {
    var foundCategories = [];
    let categories = CategoryModel.find({category_id: {$all: categoriesIds}}, {category_id: 1, _id: 0 } , (err, docs) => {
        // console.log(docs.category_id);
        // docs.forEach((doc, index) => {
        //     console.log(doc.category_id);
        //     foundCategories.push(doc.category_id);
        // });
        // console.log(foundCategories);
        console.log(docs);
        if (!docs || docs.length == 0) {
            return false;
        }

        return true;

        // return foundCategories;
    });
    // console.log(categories);
}

exports.categoryValidation = categoryValidation;