import http from "../http-common";

class LabGroupDataService {
    
    // get all lab groups
    getLabGroups(){
        return http.get('/group/')
    }
    
    deleteLabGroup(data){
        return http.delete('/group/',data)
    }
}

export default new LabGroupDataService();