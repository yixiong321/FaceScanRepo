import http from "../http-common";

class LabGroupDataService {
    
    // get all lab groups
    getLabGroups(){
        return http.get('/group/')
    }
}

export default new LabGroupDataService();