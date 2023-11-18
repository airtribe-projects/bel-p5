const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let port = 3000;

app.use(bodyParser.json());

app.post('/user', (req, res) => {
    const {user, email} = req.body;
    console.log('Received a user', user);
    res.send('User created successfully');
});

app.listen(port, ()=> {
    console.log('Server is running on port 3000');
});