import http from "../http-json";

class LabGroupDataService {
    
    // get all lab groups
    getLabGroups(){
        return http.get('/group/')
    }
}

export default new LabGroupDataService();