const expect = require('chai').expect;
const validator = require('../../src/helpers/validator');
const courseData = require('../../src/courses.json');


let courseDetails = {
    "course": "test",
    "courseId": 100,
    "cohort": 1,
    "college": "LPU",
    "semester": 2,
    "instructor": "test",
    "studentsVoted": 0,
    "averageRating": 0
};

describe("Testing the validate course info functionality", function () {
    it('1. Validating the course info - Validates the course successfuly and add the course', function(done) {
        let response = validator.validateCourseInfo(courseDetails, courseData);
        expect(response.status).equal(true);
        expect(response.message).equal('Course has been added');
        done();
    });

    it('2. Validating the course info - Fails if the course id is not unique', function(done) {
        courseDetails.courseId = 2;
        let response = validator.validateCourseInfo(courseDetails, courseData);
        expect(response.status).equal(false);
        expect(response.message).equal("Course id has to be unique");
        done();
    });

    it('3. Validating the course info - Fails if one of the properties is not defined', function(done) {
        courseDetails.courseId = 100;
        delete courseDetails['cohort'];
        let response = validator.validateCourseInfo(courseDetails, courseData);
        expect(response.status).equal(false);
        expect(response.message).equal("Course Info is malformed please provide all the properties");
        done();
    });
});

describe('Validate the uniqueness of course id', function() {
    it('Successfully validates the course Id', function(done) {
        let response = validator.validateUniqueCourseId(courseDetails, courseData);
        expect(response).equal(true);
        done();
    });

    it('Returns true in case course id collision is found', function(done) {
        courseDetails.courseId = 2;
        let response = validator.validateUniqueCourseId(courseDetails, courseData);
        expect(response).equal(false);
        done();
    });
});