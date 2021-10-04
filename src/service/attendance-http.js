import http from "../http-form";

class AttendanceDataService {

    postNewAttendance(id, data){
        return http.post(`/session/${id}/take-attendance/`, data)
    }
    // get atd from session id
    getAttendanceFromSessionId(id){
        return http.get(`/attendance/?${id}`)
    }
}

export default new AttendanceDataService();