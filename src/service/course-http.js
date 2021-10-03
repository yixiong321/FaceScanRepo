import http from "../http-json";

class CourseDataService {
    
    // get all courses
    getCourses(){
        return http.get('/course/')
    }

    getCourseById(id){
        return http.get(`/course/${id}/`)
    }

    updateCourse(id, data){
        return http.patch(`/course/${id}`,data)
    }
}

export default new CourseDataService();