const ProductModel = require('../models/products.model');
const CategoryModel = require('../models/categories.model');
const express = require("express");
const productRoute = express();
const coreFunction = require('../../includes/core.function');

productRoute.get('/products', (request, response) => {
    // response.send('This is product get request');
    // response.send('hello');
    // if(!request.query.email) {
    //     return response.status(400).send('Missing URL parameter: email');
    // }

    let foundCategory = coreFunction.categoryValidation(request.body.product_category);

    if (foundCategory) {
      console.log('hai');
    } else {
      console.log('nahi hai');
    }

    console.log(request.body.product_category);

    // CategoryModel.find({
    //   category_id: {$in: request.body.product_category}
    // },
    // 'category_id',
    // (err, docs) => {
    //   console.log(docs);
    //   docs.forEach((item, index) => {
    //     console.log(item.category_id);
    //     if (request.body.product_category.includes(item.category_id)) {
    //       return;
    //     } else {
    //       console.log(item.category_id);
    //     }
    //     // console.log(index);
    //   });
    // } 
    // );

    ProductModel.find({
    })
    .then(doc => {
        response.json(doc);
    })
    .catch(err => {
        response.status(500).json(err);
    })
});

productRoute.post('/products', (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    return res.status(400).send('Request body is missing');
  }
  
    if(!req.body.email) {
      // ...
    }
  
    // let user = {
    //   name: 'firstname lastname',
    //   email: 'email@gmail.com'
    // }
  
    let model = new ProductModel(req.body)
    model.save()
      .then(doc => {
        if(!doc || doc.length === 0) {
          return res.status(500).send(doc)
        }
  
        res.status(201).send(doc)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

module.exports = productRoute;