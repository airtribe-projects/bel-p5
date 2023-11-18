const express = require('express');
const app = express();

let port = 3000;

function logger(req, res, next){
    console.log('Request recevied ', req.method, req.url);
    //next();
}

app.use(logger);

app.get('/', (req, res) => {
    return res.send('Hello world');
})

app.listen(port, ()=> {
    console.log('Server is running on port 3000');
});