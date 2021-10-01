import http from "../http-json";

class SessionDataService {
    
    // get all sessions
    getSessions(){
        return http.get('/session/')
    }
}

export default new SessionDataService();