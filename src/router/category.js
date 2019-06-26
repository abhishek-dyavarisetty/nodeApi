const CategoryModel = require('../models/categories.model');
const express = require('express');
const categoryRoute = express();

categoryRoute.get('/categories', (request, response) => {
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
});

categoryRoute.post('/categories', (request, response) => {
    if (Object.keys(request.body).length === 0 && request.body.constructor === Object) {
        return response.status(400).send('Request body is missing');
    }

    if (request.body.category_child != 0) {
        console.log(request.body.category_child);
        CategoryModel.find({category_id: {$in: request.body.category_child}}, (errorCategoryChildFind, categoryChildFind) => {
        //     if(categoryChildFind.length !== request.body.category_child.length) {
        //         return response.status(400).send('child category does not exist');
        //     }
            if (!errorCategoryChildFind && (!categoryChildFind || categoryChildFind.length !== request.body.category_child.length)) {
                return response.status(400).send('invalid child category');
            } else if (errorCategoryChildFind) {
                return response.status(500).send(errorCategoryChildFind);
            } else {
                addCategory(request, response);
            }
        });
    } else {
        // console.log(2);
        addCategory(request, response);
    }



    // CategoryModel.find({category_id: {$all: request.body.category_child}}, {category_id: 1, _id: 0 })
    // .then(doc => {
    //     console.log(doc);
    //     if (!docs || docs.length == 0) {
    //         return response.status(400).send("invalid child category")
    //     }
    // })
    // .catch(err => {
    //     return response.status(500).json(err);
    // })

    // request.body.category_child = request.body.category_child.filter((item, pos) => {
    //     return request.body.category_child.indexOf(item) == pos;
    // })

    // let model = new CategoryModel(request.body)
    // model.save()
    // .then(doc => {
    //     if (!doc || doc.length == 0) {
    //         return response.status(500).send(doc);
    //     }
    //     response.status(201).json(doc);
    // })
    // .catch(err => {
    //     response.status(500).json(err);
    // })
})

function addCategory (request, response) {
    CategoryModel.find({category_id: request.body.category_id}, (errorCategoryFind, categoryFind) => {
        if (!errorCategoryFind && (!categoryFind || categoryFind.length === 0)) {
            let model = new CategoryModel(request.body)
            model.save().then(insertCategory => {
                if (!insertCategory || insertCategory.length === 0) {
                    return response.status(500).send(insertCategory);
                }
                response.status(201).json(insertCategory);
            })
            .catch(insertError => {
                response.status(500).json(insertError);
            })
        } else if (errorCategoryFind) {
            response.status(500).send(errorCategoryFind);
        } else {
            response.status(400).send("Category Already Exist");
        }
    });
}

module.exports = categoryRoute;