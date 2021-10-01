import http from "../http-common";

class SessionDataService {
    
    // get all sessions
    getSessions(){
        return http.get('/session/')
    }
}

export default new SessionDataService();