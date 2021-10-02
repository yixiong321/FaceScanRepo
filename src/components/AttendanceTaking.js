import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import { Container } from "react-bootstrap";
import FaceDetection from "./FaceDetection";

const AttendanceTaking = () => {
    
    const { search } = useLocation()
    //will have to include session id
    const { session_id, course_code, lab_group } = queryString.parse(search)

    return (
        <Container className="text-center">
            <h3>{`Session ID: ${session_id}`}</h3>
            <h5>{`Course Code: ${course_code}, Lab Group: ${lab_group}`}</h5>
            <FaceDetection />
        </Container>
    )
}

export default AttendanceTaking
