import http from "../http-json";

class LabGroupDataService {
    
    // get all lab groups
    getLabGroups(){
        return http.get('/group/')
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