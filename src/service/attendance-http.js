import http from "../http-form";

class AttendanceDataService {

    postNewAttendance(id, data){
        return http.post(`/session/${id}/take-attendance/`, data)
    }
}

export default new AttendanceDataService();