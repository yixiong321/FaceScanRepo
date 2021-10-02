import http from "../http-json"

class StudentInLabGroupDataService {
    
    // get lab groups of student
    getLabGroupsOfStudent(matric){
        return http.get(`/student-in-lab-group/?student__matric=${matric}`)
    }

    // post student and lab group
    postStudentInLabGroups(data){
        return http.post('/student-in-lab-group/', data)
    }

    deleteStudentInLabGroups(id){
        return http.delete(`/student-in-lab-group/${id}/`)
    }
}

export default new StudentInLabGroupDataService();