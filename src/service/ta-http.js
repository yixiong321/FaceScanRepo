import http from "../http-json";

class TADataService {
    
    getAdminById(id){
        return http.get(`/account/${id}/`)
    }

    // post TA credentials
    postTA(data){
        return http.post('/account/', data)
    }
}

export default new TADataService();