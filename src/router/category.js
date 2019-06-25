const CategoryModel = require('../models/categories.model');
const express = require('express');
const categoryRoute = express();

categoryRoute.get('/categories', (request, response) => {
    CategoryModel.find({
        category_id: { $in: [1]}
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