import http from "../http-json";

class TADataService {
    
    // post TA credentials
    postTA(data){
        return http.post('/account/', data)
    }
}

export default new TADataService();