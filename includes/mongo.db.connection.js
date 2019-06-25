const mongoose = require("mongoose");
const userName = 'dyavarisetty';
const password = 'Apms@1996sm';

let DBURI = `mongodb+srv://${userName}:${password}@cluster0-jpvd4.mongodb.net/headyTask?retryWrites=true&w=majority`;

const mongoConnect = mongoose.connect(DBURI, {useNewUrlParser: true}).then(
    () => {
        console.log('Database connection established!');
    },
    err => {
        console.log("Error connecting Database instance due to: ", err);
    }
);