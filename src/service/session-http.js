import http from "../http-json";

class SessionDataService {
    
    // get all sessions
    getSessions(){
        return http.get('/session/')
    }

    // post session
    postNewSession(data){
        return http.post('/session/', data)
    }
}

export default new SessionDataService();