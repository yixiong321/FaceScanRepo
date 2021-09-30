import http from "../http-common";

class LoginDataService {
    
    // post credentials, get token
    postToken(data){
        return http.post('/token/', data)
    }
}

export default new LoginDataService();