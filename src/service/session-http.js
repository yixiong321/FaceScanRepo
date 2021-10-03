import http from "../http-json";

class SessionDataService {
    
    // get all sessions
    getSessions(){
        return http.get('/session/')
    }

    getSessionById(id){
        return http.get(`/session/${id}/`)
    }

    // post session
    postNewSession(data){
        return http.post('/session/', data)
    }

    postNewAttendance(id, data){
        return http.post(`/session/${id}/take-attendance/`, data)
    }
}

export default new SessionDataService();