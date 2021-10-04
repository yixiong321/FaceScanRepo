import http from "../http-json";

class LoginDataService {
    
    // post credentials, get token
    postToken(data){
        return http.post('/token/', data)
    }

    postRefreshToken(data){
        return http.post('/token/refresh/', data)
    }
}

export default new LoginDataService();