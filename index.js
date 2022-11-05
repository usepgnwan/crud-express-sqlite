const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('./db/config');
const { router } = require('./router/router.js');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json());
app.use(router);
app.listen('3000', () => {
    console.log('Server Running at http://localhost:3000')
})