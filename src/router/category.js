const CategoryModel = require('../models/categories.model');
const express = require('express');
const categoryRoute = express();

categoryRoute.get('/categories', (request, response) => {

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

    CategoryModel.find({
    })
    .then(doc => {
        response.json(doc);
    })
    .catch(err => {
        response.status(500).json(err);
    })
});

categoryRoute.post('/categories', (request, response) => {
    if (Object.keys(request.body).length === 0 && request.body.constructor === Object) {
        return response.status(400).send('Request body is missing');
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

    let model = new CategoryModel(request.body)
    model.save()
    .then(doc => {
        if (!doc || doc.length == 0) {
            return response.status(500).send(doc);
        }
        response.status(201).json(doc);
    })
    .catch(err => {
        response.status(500).json(err);
    })
})

module.exports = categoryRoute;