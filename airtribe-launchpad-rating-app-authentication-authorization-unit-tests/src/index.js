const express = require('express');
const courseData = require('./courses.json');
const validator = require('./helpers/validator');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const {signin, signup} = require('./controllers/authController');
const verifyToken = require('./middleware/authJWT');
require('dotenv').config();
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

if(process.env.NODE_ENV != 'test') {
try {
    mongoose.connect("mongodb://localhost:27017/usersdb", {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log("connected to the db");
} catch (err) {
    console.log("error connecting to the db");
}
}

app.post('/register', signup);

app.post('/login', signin);


app.get('/', (req, res) => {   
    return res.status(200).send("hello world");
});

app.get('/courses', (req, res) => {
    return res.status(200).json(courseData);
});

app.get('/courses/:courseId', (req, res) => {
    let airtribeCourses = courseData.airtribe;
    let courseIdPassed = req.params.courseId;
    let filteredCourse = airtribeCourses.filter(val => val.courseId == courseIdPassed);
    if (filteredCourse.length == 0) {
        return res.status(404).send("No appropriate course found with the provided id");
    }
    return res.status(200).json(filteredCourse[0]);
});

app.post('/courses', verifyToken, (req, res) => {
    if(req.user) {
        const userProvidedDetails = req.body;
        console.log(req.body);
        let writePath = path.join(__dirname, '..', 'courses.json');
        if(validator.validateCourseInfo(userProvidedDetails, courseData).status == true) {
            let courseDataModified = JSON.parse(JSON.stringify(courseData));
            courseDataModified.airtribe.push(userProvidedDetails);
            fs.writeFile(writePath, JSON.stringify(courseDataModified), {encoding: 'utf8', flag:'w'}, (err, data) => {
                if(err) {
                    return res.status(500).send("Something went wrong while creating the course");
                } else {
                    return res.status(201).send(validator.validateCourseInfo(userProvidedDetails, courseData).message);
                }
            });
        } else {
            res.status(400).json(validator.validateCourseInfo(userProvidedDetails, courseData));
        }
    } else {
        return res.status(403).send({
            message: req.message
        });
    }
});

app.listen(PORT, (error) => {
    if(error) {
        console.log("something went wrong while starting the server");
    } else {
        console.log("server is running on port 3000");
    }
});

module.exports = app;