const express = require('express');
const routes = require('express').Router();
const airQuality = require('./controllers/airQuality');
const app = express();

app.use(routes);
let port = 3000;

routes.get('/', (req, res) => {
    return res.send("hello world");
});

routes.use('/airQualities', airQuality);

app.listen(port, (err) => {
    if(!err) {
        console.log('Server is running on port 3000');
    }
});