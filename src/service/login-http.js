import http from "../http-json";

class LoginDataService {
    
    // post credentials, get token
    postToken(data){
        return http.post('/token/', data)
    }
}

export default new LoginDataService();