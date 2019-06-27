const mongoose = require('mongoose');

let uniqueIdSchema = new mongoose.Schema({
    unique_key: String,
    unique_id: Number
});

module.exports = mongoose.model('uniqueid', uniqueIdSchema);