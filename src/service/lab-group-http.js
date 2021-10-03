import http from "../http-json";

class LabGroupDataService {
    
    // get all lab groups
    getLabGroups(){
        return http.get('/group/')
    }

    getLabGroupById(id){
        return http.get(`/group/${id}/`)
    }
    
    // delete Lab Group by id
    deleteLabGroup(id){
        return http.delete(`/group/${id}`)
    }

    updateLabGroup(id,data){
        return http.patch(`/group/${id}/`,data)
    }
}

export default new LabGroupDataService();