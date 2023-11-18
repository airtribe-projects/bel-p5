const express = require('express');
const app = express();

let port = 3000;

function firstMiddleware(req, res, next) {
    console.log('First');
    next();
}

function secondMiddleware(req, res, next) {
    console.log('Second');
    next();
}

app.use(secondMiddleware);
app.use(firstMiddleware);


app.get('/', secondMiddleware, (req, res) => {
    return res.send('Hello world');
})

app.listen(port, ()=> {
    console.log('Server is running on port 3000');
});