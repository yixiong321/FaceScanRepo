import http from "../http-json";

class CourseDataService {
    
    // get all course
    getCourses(){
        return http.get('/course/')
    }
}

export default new CourseDataService();