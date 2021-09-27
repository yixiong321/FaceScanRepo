import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import { Container } from "react-bootstrap";
import FaceDetection from "./FaceDetection";

const AttendanceTaking = () => {
    
    const { search } = useLocation()
    //will have to include session id
    const { code, index, group } = queryString.parse(search)

    return (
        <Container className="text-center">
            <h3>{`Session ID: To be included`}</h3>
            <h5>{`Course Code: ${code}, Course Index: ${index}, Lab Group: ${group}`}</h5>
            <FaceDetection />
        </Container>
    )
}

export default AttendanceTaking
