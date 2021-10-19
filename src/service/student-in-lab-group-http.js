import http from "../http-json"

class StudentInLabGroupDataService {
    
    // get lab groups of student
    getLabGroupsOfStudent(matric){
        return http.get(`/student-in-lab-group/?student__matric=${matric}`)
    }
    // get lab groups of student by lab group id
    getLabGroupsOfStudentByLabGrpID(id){
        return http.get(`/student-in-lab-group/?lab_group_id=${id}`)
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