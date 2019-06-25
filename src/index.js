const express = require('express');
const app = express();
const path = require('path')
const bodyParser = require('body-parser')

let productRouter = require('./router/product');
let categoryRoute = require('./router/category');

require('../includes/mongo.db.connection');

// app.use(mongoose);

app.use(bodyParser.json());
app.use(categoryRoute);
app.use(productRouter);
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT);