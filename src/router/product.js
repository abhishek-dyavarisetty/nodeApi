const ProductModel = require('../models/products.model');
const CategoryModel = require('../models/categories.model');
const express = require("express");
const productRoute = express();
const coreFunction = require('../../includes/core.function');

productRoute.get('/products', (request, response) => {

  // console.log(request.body.product_category);
  console.log(uniqueArray)

  ProductModel.find({
  })
    .then(doc => {
      return response.json(doc);
    })
    .catch(err => {
      return response.status(500).json(err);
    });
});

productRoute.post('/products', (request, response) => {
  if (Object.keys(request.body).length === 0 && request.body.constructor === Object) {
    return response.status(400).send('Request body is missing');
  }

  // CategoryModel.find({category_id: {$all: request.body.product_category}}, {category_id: 1, _id: 0 })
  //   .then(docs => {
  //     if (!docs || docs.length == 0) {
  //       return response.status(400).send("invalid category")
  //     }
  //   })
  //   .catch(err => {
  //     return response.status(500).json(err);
  //   });

  // let user = {
  //   name: 'firstname lastname',
  //   email: 'email@gmail.com'
  // }
  // request.body.product_category = request.body.product_category.filter((item, pos) => {
  //   return request.body.product_category.indexOf(item) == pos;
  // })
  // console.log(request.body.product_category.length);
  if (request.body.product_category.length != 0) {
    CategoryModel.find({product_category: {$all: request.body.product_category}}, (errorCategoryFind, categoryFind) => {
      if (!errorCategoryFind && (!categoryFind || categoryFind.length == 0)) {
        return response.status(400).send('invalid category');
      } else if (errorCategoryFind) {
        return response.status(500).send(errorCategoryFind);
      } else {
        console.log(1);
        addProduct(request, response);
        // return productResponse;
      }
    });
  } else {
    console.log(2);
    addProduct(request, response);
    // return productResponse;
  }


  
  // let model = new ProductModel(request.body)
  // model.save()
  //   .then(doc => {
  //     if (!doc || doc.length === 0) {
  //       return response.status(500).send(doc)
  //     }

  //     response.status(201).send(doc)
  //   })
  //   .catch(err => {
  //     response.status(500).json(err)
  //   })
})

function addProduct (request, response) {
  console.log(request.body);
  ProductModel.find({product_id: request.body.product_id}, (errorProductFind, productFind) => {
    if (!errorProductFind && (!productFind || productFind.length === 0)) {
      console.log('if me');
      let model = new ProductModel(request.body);
      model.save().then(insertProduct => {
        if (!insertProduct || insertProduct.length === 0) {
          return response.status(400).send(insertProduct)
        }
        response.status(201).send(insertProduct);
      }).catch(insertError => {
        response.status(500).json(insertError);
      });
    } else if (errorProductFind) {
      return response.status(500).send(errorProductFind);
    } else {
      console.log('exist');
      return response.status(400).send('Product Already Exist');
    }
  });
}

module.exports = productRoute;