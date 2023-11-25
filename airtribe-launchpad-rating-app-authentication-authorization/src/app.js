const express = require('express');
const courseData =  require('../src/courses.json');
const validator  = require('../src/helpers/validator');
const path = require('path');
const fs = require('fs');
var bcrypt = require('bcrypt');
const User = require('./models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/authJWT');
require('dotenv').config();

const app = express();
app.use(express.json());

let port = 3000;

try {
    mongoose.connect("mongodb://localhost:27017/usersdb", {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log("connected to the db");
}catch (err) {
    console.log("Error connecting to the db");
}

app.get('/', function(req, res) {
    return res.status(200).send('Hello world');
});

app.get('/courses', function(req, res) {
    return res.status(200).send(courseData);
});

app.post('/register', function(req, res) {
    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    user.save().then(data => {
        return res.status(200).json({message: "user saved successfully"});
    }).catch(err => {
        return res.status(500).json({message: `User saving failed ${err}`});
    });
});

app.post('/login', function(req, res) {
    let emailPassed = req.body.email;
    let passwordPassed = req.body.password;
    User.findOne({
        email: emailPassed
    }).then((user) => {
        var passwordIsValid = bcrypt.compareSync(passwordPassed, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({message: "Invalid Passowrd!"});
        }
        var token = jwt.sign({
           id: user.id
        }, "THIS IS SECRET", {
            expiresIn: 86400
        });
        return res.status(200).json({
            user: {
                id: user.id
            },
            message: "Login successful",
            accessToken: token
        });
    });
})

app.get('/courses/:courseId', function(req, res) {
    let courseIdPassed = req.params.courseId;
    let airtribeCourse = courseData.airtribe;
    let result = airtribeCourse.filter(val => val.courseId == courseIdPassed);

    return res.status(200).send(result);
});

app.post('/courses', verifyToken,  (req, res) => {
    if (req.user) {
        const userProvidedDetails = req.body;
        console.log(req.body);
        let writePath = path.join(__dirname, '..', 'courses.json');
        if(validator.validateCourseInfo(userProvidedDetails).status == true) {
            let courseDataModified = JSON.parse(JSON.stringify(courseData));
            courseDataModified.airtribe.push(userProvidedDetails);
            fs.writeFile(writePath, JSON.stringify(courseDataModified), {encoding: 'utf8', flag:'w'}, (err, data) => {
                if(err) {
                    return res.status(500).send("Something went wrong while creating the course");
                } else {
                    return res.status(201).send(validator.validateCourseInfo(userProvidedDetails).message);
                }
            });
        } else {
            res.status(400).json(validator.validateCourseInfo(userProvidedDetails));
        }
    } else {
        return res.status(403).send({
            message: req.message
        })
    }
    
});


app.listen(port, (err) => {
    if(err) {
        console.log('Some error encountered');
    } else {
        console.log('Server started on port 3000');
    }
});

