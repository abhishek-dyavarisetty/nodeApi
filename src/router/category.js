const CategoryModel = require('../models/categories.model');
const UniqueIdModel = require('../models/unique.id');
const express = require('express');
const categoryRoute = express();

categoryRoute.get('/categories', (request, response) => {
    CategoryModel.find({}, (errorGetCategory, getCategory) => {
        // console.log(errorGetCategory);
        // response.send(getCategory);
        if (errorGetCategory) {
            return response.status(500).send(errorGetCategory);
        }
        if (getCategory && getCategory !== 0) {
            return response.status(200).send(getCategory);
        }
    });
});

categoryRoute.post('/categories', (request, response) => {
    if (isObjectEmpty(request.body)) {
        return response.status(400).send('Request body is missing');
    } else {
        UniqueIdModel.findOneAndUpdate({unique_key: 'category_id'}, {$inc: {unique_id: 1}},(errorGetuniqueId, getuniqueId) => {
            if (errorGetuniqueId) {
              return false;
            } else {
              console.log(getuniqueId);
              request.body.category_id = getuniqueId.unique_id;
              console.log(request.body);
            }
        });
    }

    CategoryModel.find({category_id: request.body.category_id}, (errorFindCategoryId, findCategoryId) => {
        if (errorFindCategoryId) {
            return response.status(500).send(errorFindCategoryId);
        }
        if (!findCategoryId || findCategoryId.length === 0) {
            if (request.body.category_child.length !== 0) {
                CategoryModel.find({category_id: {$in: request.body.category_child}}, (errorFindCategory, findCategory) => {
                    if (errorFindCategory) {
                        return response.status(500).send(errorFindCategory);
                    }
                    if (findCategory && findCategory.length == request.body.category_child.length) {
                        // console.log('perfect');
                        CategoryModel.create(request.body, (errorCategoryCreate, categoryCreate) => {
                            if (errorCategoryCreate) {
                                return response.status(500).send(errorCategoryCreate);
                            } else if (categoryCreate && categoryCreate !== 0) {
                                return response.status(201).send(categoryCreate);
                            }
                        });
                    } else {
                        return response.status(400).send('Something worng with product_category or category does not exist');
                    }
                })
            } else {
                CategoryModel.create(request.body, (errorCategoryCreate, categoryCreate) => {
                    if (errorCategoryCreate) {
                        return response.status(500).send(errorCategoryCreate);
                    } else if (categoryCreate && categoryCreate !== 0) {
                        return response.status(201).send(categoryCreate);
                    }
                });
            }
        } else {
            return response.status(400).send('Category with category id: '+request.body.category_id+' already exist');
        }
    });
});

function isObjectEmpty(object) {
    for(var key in object) {
      if(object.hasOwnProperty(key)) {
        return false;
      }
    }
  return true;
  }

module.exports = categoryRoute;