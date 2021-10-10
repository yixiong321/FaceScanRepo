import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { Container, Spinner } from "react-bootstrap";
import FaceDetection from "./FaceDetection";
import { useState, useEffect, useCallback } from "react";
import SessionDataService from "../service/session-http";
import LabGroupDataService from "../service/lab-group-http";
import CourseDataService from "../service/course-http";

const AttendanceTaking = () => {
  const { search } = useLocation();
  const [validPage, setValidPage] = useState(false);
  const { session, course, lab_group } = queryString.parse(search);
  const [pageInfo, setPageInfo] = useState({});

  const checkValidPage = async() => {
    try {
      const response1 = await SessionDataService.getSessionById(session);
      const { session_name } = response1.data;
      if (lab_group != response1.data.lab_group) {
        return;
      }
      const response2 = await LabGroupDataService.getLabGroupById(lab_group);
      const { lab_group_name } = response2.data;
      if (course != response2.data.course) {
        return;
      }

      const response3 = await CourseDataService.getCourseById(course);
      const { course_name, course_code } = response3.data;

      setPageInfo({
        ...pageInfo,
        session_id: session,
        session_name,
        course_id: course,
        lab_group_id: lab_group,
        lab_group_name,
        course_name,
        course_code,
      });

      setValidPage(true);
    } catch (e) {
      setValidPage(false);
    }
  }

  useEffect(() => {
    checkValidPage();
  }, []);

  return validPage ? (
    <Container className="text-center overflow-hidden">
      <h3>{`Session ID: ${pageInfo.session_id}, Session Name: ${pageInfo.session_name}`}</h3>
      <h5>{`Course Code: ${pageInfo.course_code}, Course Name: ${pageInfo.course_name}, Lab Group: ${pageInfo.lab_group_name}`}</h5>
      <FaceDetection {...pageInfo} />
    </Container>
  ) : (
    <Container className="text-center">
      <Spinner animation="border" />
      <h4>If loading is taking too long, please reload</h4>
    </Container>
  );
};

export default AttendanceTaking;
