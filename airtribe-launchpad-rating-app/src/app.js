const express = require('express');
const courseData =  require('../src/courses.json');
const validator  = require('../src/helpers/validator');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

let port = 3000;

app.get('/', function(req, res) {
    return res.status(200).send('Hello world');
});

app.get('/courses', function(req, res) {
    return res.status(200).send(courseData);
});

app.get('/courses/:courseId', function(req, res) {
    let courseIdPassed = req.params.courseId;
    let airtribeCourse = courseData.airtribe;
    let result = airtribeCourse.filter(val => val.courseId == courseIdPassed);

    return res.status(200).send(result);
});

app.post('/courses', function(req, res) {
    let courseDetails = req.body;
    console.log(courseDetails);
    if(validator.validateCourseInfo(courseDetails, courseData)) {
         let courseDataModified = JSON.parse(JSON.stringify(courseData));
         courseDataModified.airtribe.push(courseDetails);
         let writePath = path.join(__dirname, '.', 'courses.json');
         console.log(courseDataModified);
         fs.writeFileSync(writePath, JSON.stringify(courseDataModified), {encoding: 'utf8', flag: 'w'});
         return res.status(200).send('Course info has been added');
    } else {
        return res.status(400).send("Request you send has something incorrect");
    }
});


app.listen(port, (err) => {
    if(err) {
        console.log('Some error encountered');
    } else {
        console.log('Server started on port 3000');
    }
});

