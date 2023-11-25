class validator {
    static validateCourseInfo(courseInfo, courseData) {
        let valueFound = courseData.airtribe.some(val => val.courseId == courseInfo.courseId);
        if(valueFound) return false;
        return true;
    }
}
module.exports = validator;