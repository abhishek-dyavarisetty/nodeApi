const ProductModel = require('../models/products.model');
const CategoryModel = require('../models/categories.model');
const express = require("express");
const productRoute = express();
const coreFunction = require('../../includes/core.function');

productRoute.get('/products', (request, response) => {

  // console.log(request.body.product_category);
  // console.log(uniqueArray)

//   ProductModel.aggregate([
//     {
//       // $unwind: $category_id
//     },
//     {
//       $lookup: {
//         from: "categories",
//         localField: "category_id",
//         forigenField: "product_category",
//         as: "category"
//       }
//     },
//     {
//       $match: { "category": { $ne: [] } }
//    }
//   ], (error, docs) => {
//     console.log(docs);
//   })

//   ProductModel.find({
//   })
//     .then(doc => {
//       return response.json(doc);
//     })
//     .catch(err => {
//       return response.status(500).json(err);
//     });
// });
// console.log(CategoryModel);
// CategoryModel.find({}, {category_id: 1, category_name: 1, _id: 0}, (errorCategoryFind, categoryFind) => {
//   if (!errorCategoryFind && (!categoryFind || categoryFind.length === 0)) {
//     return response.status(400).send('Category Not found');
//   } else if (errorCategoryFind) {
//     return response.status(500).send(errorCategoryFind);
//   } else {
//     return response.status(200).send(categoryFind);
//   }
var category = {};
var childCategory = [];
CategoryModel.find({}, {category_id: 1, category_name: 1, category_child: 1, _id: 0}, (errorCategoryFind, categoryFind) => {
  if (!errorCategoryFind && (!categoryFind || categoryFind.length === 0)) {
    return response.status(400).send('no category present');
  } else if (errorCategoryFind) {
    return response.status(500).send(errorCategoryFind);
  } else {
    categoryFind.forEach((items, index) => {
      // let id = items.category_id;
      category[items.category_id] = items.category_name;
      childCategory.push(items.category_child);
      // let childCatedoryIds = categoryFind.category_child;
      // console.log(childCatedoryIds);
    });
    childCategory.forEach((items) => {
      items.forEach((item, index )=> {
        items[index] = {category_id: item ,category_name: category[item]};
        // console.log(category[item]);
      });
    });
    // categoryFind.forEach((item) => {
    //   console.log(item.category_child);
    // });
    // return response.status(200).send(categoryFind);
  }
  // console.log(category);
  // console.log(childCategory);
  // console.log(categoryFind);
  response.status(200).send(categoryFind);
});
// .then(doc => {
//     response.json(doc);
// })
// .catch(err => {
//     response.status(500).json(err);
// })
});

productRoute.post('/products', (request, response) => {
  if (Object.keys(request.body).length === 0 && request.body.constructor === Object) {
    return response.status(400).send('Request body is missing');
  }

  if (request.body.product_category.length !== 0) {
    CategoryModel.find({category_id: {$in: request.body.product_category}}, (errorCategoryFind, categoryFind) => {
      if (!errorCategoryFind && (!categoryFind || categoryFind.length !== request.body.product_category)) {
        return response.status(400).send('invalid category');
      } else if (errorCategoryFind) {
        return response.status(500).send(errorCategoryFind);
      } else {
        addProduct(request, response);
        // return productResponse;
      }
    });
  } else {
    addProduct(request, response);
    // return productResponse;
  }
})

function addProduct (request, response) {
  console.log(request.body);
  ProductModel.find({product_id: request.body.product_id}, (errorProductFind, productFind) => {
    if (!errorProductFind && (!productFind || productFind.length === 0)) {
      let model = new ProductModel(request.body);
      model.save().then(insertProduct => {
        if (!insertProduct || insertProduct.length === 0) {
          return response.status(500).send(insertProduct)
        }
        response.status(201).send(insertProduct);
      }).catch(insertError => {
        response.status(500).json(insertError);
      });
    } else if (errorProductFind) {
      return response.status(500).send(errorProductFind);
    } else {
      return response.status(400).send('Product Already Exist');
    }
  });
}

module.exports = productRoute;