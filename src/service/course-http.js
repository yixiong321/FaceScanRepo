import http from "../http-json";

class CourseDataService {
    
    // get all course
    getCourses(){
        return http.get('/course/')
    }

    updateCourse(id,data){
        return http.patch(`/course/${id}`,data)
    }
}

export default new CourseDataService();