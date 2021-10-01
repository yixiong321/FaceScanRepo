import http from "../http-json";

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