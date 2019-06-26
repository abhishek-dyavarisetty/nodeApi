const ProductModel = require('../models/products.model');
const CategoryModel = require('../models/categories.model');
const express = require("express");
const productRoute = express();
const coreFunction = require('../../includes/core.function');

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
});

productRoute.get('/products/category/:id', (request, response) => {
  ProductModel.find({product_category: request.params.id}, {product_category: 1, product_id: 1, product_name: 1, _id: 0}, (errorProductsByCategory, productsByCategory) => {
    // response.send(productsByCategory);
    if (!errorProductsByCategory && (!productsByCategory || productsByCategory === 0)) {
      return response.status(400).send('invalid request');
    } else if (errorProductsByCategory) {
      return response.status(500).send(errorProductsByCategory);
    } else {
      return response.status(200).send(productsByCategory);
    }
  });
});

productRoute.put('/product', (request, response) => {
  if (!request.query.id) {
    return response.status(400).send("Missing URL parameter: id");
  } else {
    if (request.body.product_category.length !== 0) {
      CategoryModel.find({category_id: {$in: request.body.product_category}}, (errorCategoryFind, categoryFind) => {
        if (!errorCategoryFind && (!categoryFind || categoryFind.length !== request.body.product_category.length)) {
          return response.status(400).send('invalid category');
        } else if (errorCategoryFind) {
          return response.status(500).send(errorCategoryFind);
        } else {
          updateProduct(request, response);
          // return productResponse;
        }
      });
    } else {
      updateProduct(request, response);
      // return productResponse;
    }
  }
});

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

function updateProduct(request, response) {
  ProductModel.findOne({product_id: request.query.id}, (errorProductIdFind, productIdFind) => {
    // return console.log(productIdFind.product_id);
    if (!errorProductIdFind && productIdFind) {
      if (request.query.id == request.body.product_id) {
        ProductModel.findOneAndUpdate({product_id: request.query.id}, request.body, {useFindAndModify: false ,new: true}, (errorProductFind, productFind) => {
          if (!errorProductFind && (!productFind || productFind === 0)) {
            return response.status(400).send('invalid request');
          } else if (errorProductFind) {
            return response.status(500).send(errorProductFind);
          } else {
            return response.status(200).send(productFind);
          }
        });
      } else {
        return response.status(400).send('Product id does not match with the query string');
      }
    } else {
      return response.status(400).send('Product does not exist please adding the product');
    }
  //   if (!errorProductIdFind && (productIdFind !== 0 || request.query.id == request.body.product_id)) {
  //     ProductModel.findOneAndUpdate({product_id: request.query.id}, request.body, {useFindAndModify: false ,new: true}, (errorProductFind, productFind) => {
  //       if (!errorProductFind && (!productFind || productFind === 0)) {
  //         return response.status(400).send('invalid request');
  //       } else if (errorProductFind) {
  //         return response.status(500).send(errorProductFind);
  //       } else {
  //         return response.status(200).send(productFind);
  //       }
  //     }); 
  //   } else if (errorProductIdFind) {
  //     return response.status(500).send(errorProductIdFind);
  //   } else {
  //     if (!productIdFind || productIdFind === 0) {
  //       return response.status(400).send('Product does not exist please adding the product');
  //     } else {
  //       return response.status(400).send('Product Id already exist');
  //     }
  //   }
  });
}

module.exports = productRoute;