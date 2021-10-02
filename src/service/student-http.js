import http from "../http-form"

class StudentDataService {
    
    // get student by matric
    getStudentByMatric(matric){
        return http.get(`/student/?matric=${matric}`)
    }

    // post student credentials
    postStudent(data){
        return http.post('/student/', data)
    }

    // update student data
    patchStudent(id, data){
        return http.patch(`/student/${id}/`, data)
    }

    // delete student by id
    deleteStudent(id){
        return http.delete(`/student/${id}/`)
    }
}

export default new StudentDataService();