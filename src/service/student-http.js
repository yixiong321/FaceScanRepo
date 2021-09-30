import http from "../http-common";

class StudentDataService {
    
    // post student credentials
    postStudent(data){
        return http.post('/student/', data)
    }
}

export default new StudentDataService();