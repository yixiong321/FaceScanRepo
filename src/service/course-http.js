import http from "../http-common";

class CourseDataService {
    
    // get all course
    getCourses(){
        return http.get('/course/')
    }
}

export default new CourseDataService();