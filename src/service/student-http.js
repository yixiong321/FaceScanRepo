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
    putStudent(id, data){
        return http.put(`/student/${id}`, data)
    }

    // delete student by id
    deleteStudent(id){
        return http.delete(`/student/${id}`)
    }
}

export default new StudentDataService();