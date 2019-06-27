const ProductModel = require('../models/products.model');
const CategoryModel = require('../models/categories.model');
const UniqueIdModel = require('../models/unique.id');
const express = require("express");
const productRoute = express();

productRoute.post('/products', (request, response) => {
  if (isObjectEmpty(request.body)) {
    return response.status(400).send('Request body is missing');
  } else {
    UniqueIdModel.findOneAndUpdate({unique_key: 'product_id'},{$inc: {unique_id: 1}}, (errorGetuniqueId, getuniqueId) => {
      if (errorGetuniqueId) {
        return false;
      } else {
        console.log(getuniqueId);
        request.body.product_id = getuniqueId.unique_id;
      }
    });
    // console.log(getNextuniqueId('product_id'));
  }

  ProductModel.find({product_id: request.body.product_id}, (errorFindProductId, findProductId) => {
    // console.log(errorFindProductId);
    if (errorFindProductId) {
      return response.status(500).send(errorFindProductId);
    }
    if (!findProductId || findProductId.length === 0) {
      // console.log('findProductId');
      if (request.body.product_category.length !== 0) {

        CategoryModel.find({category_id: {$in: request.body.product_category}}, (errorFindCategory, findCategory) => {
          // console.log(findCategory);
          if (errorFindCategory) {
            return response.status(500).send(errorFindCategory);
          }
          if (findCategory && findCategory.length == request.body.product_category.length) {
            // console.log('perfect');
            ProductModel.create(request.body, (errorProductCreate, productCreate) => {
              if (errorProductCreate) {
                return response.status(500).send(errorProductCreate);
              } else if (productCreate && productCreate !== 0) {
                return response.status(201).send(productCreate);
              }
            });
          } else {
            return response.status(400).send('Something worng with product_category or category does not exist');
          }
        })
      } else {
        ProductModel.create(request.body, (errorProductCreate, productCreate) => {
          if (errorProductCreate) {
            return response.status(500).send(errorProductCreate);
          } else if (productCreate && productCreate !== 0) {
            return response.status(201).send(productCreate);
          }
        });
      }
    } else {
      return response.status(400).send('Product with product id: '+request.body.product_id+' already exist');
    }
  });
});

productRoute.get('/products/category/:id', (request, response) => {
  ProductModel.find({product_category: request.params.id}, (errorGetProductsByCategory, productsGetByCategory) => {
    // response.send(productsByCategory);
    if (errorGetProductsByCategory) {
      return response.status(500).send(errorGetProductsByCategory);
    }
    if (productsGetByCategory && productsGetByCategory !== 0) {
      return response.status(200).send(productsGetByCategory);
    }
  });
});

productRoute.put('/product', (request, response) => {
  if (!request.query.id) {
    return response.status(400).send("Missing URL parameter: id");
  } 

  if (isObjectEmpty(request.body)) {
    return response.status(400).send('Request body is missing');
  }

  request.body.product_id = request.query.id;
  // console.log(request.body);

  ProductModel.find({product_id: request.body.product_id}, (errorProductExists, productExists) => {
    if (errorProductExists) {
      return response.status(500).send(errorProductUpdtate);
    }
    // response.send(productExists);
    if (productExists && productExists.length == 1) {
      console.log('gusa');
      if (request.body.product_category.length !== 0) {
        CategoryModel.find({category_id: {$in: request.body.product_category}}, (errorCategoryFind, findCategory) => {
          if (errorCategoryFind) {
            return response.status(500).send(errorCategoryFind);
          }
          if (findCategory && findCategory.length == request.body.product_category.length) {
            ProductModel.findOneAndUpdate({product_id: request.body.product_id}, request.body, {new: true}, (errorProductUpdate, productUpdate) => {
              if (errorProductUpdate) {
                // console.log(errorProductUpdate);
                return response.status(500).send(errorProductUpdate);
              }
              if (productUpdate) {
                return response.status(200).send(productUpdate);
              }
            });
          } else {
            return response.status(400).send('Something worng with product_category or category does not exist');
          }
        });
      } else {
        ProductModel.findOneAndUpdate({product_id: request.body.product_id}, request.body, {new: true}, (errorProductUpdate, productUpdate) => {
          if (errorProductUpdate) {
            // console.log(errorProductUpdate);
            return response.status(500).send(errorProductUpdate);
          }
          if (productUpdate) {
            return response.status(200).send(productUpdate);
          }
        });
      }
    } else {
      return response.status(400).send('Product with product id: '+request.body.product_id+' does not exist');
    }
  });
});
  
//   else {
//     if (request.body.product_category.length !== 0) {
//       CategoryModel.find({category_id: {$in: request.body.product_category}}, (errorCategoryFind, categoryFind) => {
//         if (!errorCategoryFind && (!categoryFind || categoryFind.length !== request.body.product_category.length)) {
//           return response.status(400).send('invalid category');
//         } else if (errorCategoryFind) {
//           return response.status(500).send(errorCategoryFind);
//         } else {
//           updateProduct(request, response);
//           // return productResponse;
//         }
//       });
//     } else {
//       updateProduct(request, response);
//       // return productResponse;
//     }
//   }
// });

// function updateProduct(request, response) {
//   ProductModel.findOne({product_id: request.query.id}, (errorProductIdFind, productIdFind) => {
//     // return console.log(productIdFind.product_id);
//     if (!errorProductIdFind && productIdFind) {
//       if (request.query.id == request.body.product_id) {
//         ProductModel.findOneAndUpdate({product_id: request.query.id}, request.body, {useFindAndModify: false ,new: true}, (errorProductFind, productFind) => {
//           if (!errorProductFind && (!productFind || productFind === 0)) {
//             return response.status(400).send('invalid request');
//           } else if (errorProductFind) {
//             return response.status(500).send(errorProductFind);
//           } else {
//             return response.status(200).send(productFind);
//           }
//         });
//       } else {
//         return response.status(400).send('Product id does not match with the query string');
//       }
//     } else {
//       return response.status(400).send('Product does not exist please adding the product');
//     }
//   //   if (!errorProductIdFind && (productIdFind !== 0 || request.query.id == request.body.product_id)) {
//   //     ProductModel.findOneAndUpdate({product_id: request.query.id}, request.body, {useFindAndModify: false ,new: true}, (errorProductFind, productFind) => {
//   //       if (!errorProductFind && (!productFind || productFind === 0)) {
//   //         return response.status(400).send('invalid request');
//   //       } else if (errorProductFind) {
//   //         return response.status(500).send(errorProductFind);
//   //       } else {
//   //         return response.status(200).send(productFind);
//   //       }
//   //     }); 
//   //   } else if (errorProductIdFind) {
//   //     return response.status(500).send(errorProductIdFind);
//   //   } else {
//   //     if (!productIdFind || productIdFind === 0) {
//   //       return response.status(400).send('Product does not exist please adding the product');
//   //     } else {
//   //       return response.status(400).send('Product Id already exist');
//   //     }
//   //   }
//   });
// }

function isObjectEmpty(object) {
  for(var key in object) {
    if(object.hasOwnProperty(key)) {
      return false;
    }
  }
return true;
}

module.exports = productRoute;