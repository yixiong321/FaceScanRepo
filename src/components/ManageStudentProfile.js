import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Image,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import StudentDataService from "../service/student-http";
import StudentInLabGroupDataService from "../service/student-in-lab-group-http";
import { useGlobalContext } from "./Context";

const ManageStudentProfile = () => {
  const { globalLabGroups } = useGlobalContext();
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState({});
  const [loaded, setLoaded] = useState(false);
  const initialInfo = {
    id: 0,
    name: "",
    matric: "",
    photo: {},
    lab_groups: [],
    previewPhoto: "",
  };
  const [info, setInfo] = useState(initialInfo);
  const [errors, setErrors] = useState({});
  const [deleteProfile, setDeleteProfile] = useState(false);
  const [checkedState, setCheckedState] = useState({});

  useEffect(() => {
    const { id, name, matric, photo, previewPhoto, lab_groups } = searchResult;
    setInfo({ id, name, matric, photo, previewPhoto, lab_groups });

    let initialCheckedState = {};
    globalLabGroups.map(({ lab_group_id }) => {
      return (initialCheckedState[lab_group_id] = false);
    });
    lab_groups?.map(({ lab_group }) => {
      return (initialCheckedState[lab_group] = true);
    });
    setCheckedState(initialCheckedState);
  }, [searchResult, globalLabGroups]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoaded(false);
    if (searchText.length === 0) {
      return setSearchResult({});
    }
    let studentProfile = await StudentDataService.getStudentByMatric(
      searchText
    );

    if (studentProfile.data.length > 0) {
      const { matric } = studentProfile.data[0];
      let lab_groups = await StudentInLabGroupDataService.getLabGroupsOfStudent(
        matric
      );
      setSearchResult({
        ...studentProfile.data[0],
        previewPhoto: studentProfile.data[0].photo,
        lab_groups: lab_groups.data,
      });
    } else {
      setSearchResult({});
    }
      setLoaded(true);
  };

  const handleChange = (field, value) => {
    setInfo({
      ...info,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });

    if (field === "photo") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setInfo({ ...info, photo: value, previewPhoto: reader.result });
        }
      };
      if (value instanceof Blob) {
        reader.readAsDataURL(value);
      }
    }
  };

  const handleCheckbox = (id) => {
    checkedState[id] = !checkedState[id];
    setCheckedState({ ...checkedState });
  };

  const findFormErrors = async () => {
    const { photo } = info;
    const newErrors = {};
    const response = await checkAccountInDB();

    if (response && response.name) {
      newErrors.name = response.name[0];
    }
    if (response && response.matric) {
      newErrors.matric = response.matric[0];
    }
    const fileType = photo["type"];
    if (fileType !== undefined && fileType.split("/")[0] !== "image") {
      newErrors.photo = "Upload only a .png/.jpg/.jpeg file";
    }

    return newErrors;
  };

  const checkAccountInDB = async () => {
    const { id, name, matric, photo } = info;

    let fd = new FormData();
    fd.append("name", name);
    fd.append("matric", matric);
    if (typeof photo !== "string") {
      fd.append("photo", photo);
      fd.append("type", photo.type);
    }

    try {
      await StudentDataService.patchStudent(id, fd);
      await handleDeleteLabGroups();
      await handleAddLabGroups();
    } catch (e) {
      return e.response.data;
    }
  };

  const handleDeleteLabGroups = async () => {
    info.lab_groups.map(async ({ id, lab_group }) => {
      if (!checkedState[lab_group]) {
        await StudentInLabGroupDataService.deleteStudentInLabGroups(id);
      }
    });
  };

  const handleAddLabGroups = async () => {
    for (const lab_group_id in checkedState) {
      if (checkedState[lab_group_id]) {
        let found = info.lab_groups.filter(
          ({ lab_group }) => lab_group == lab_group_id
        );
        if (found.length === 0) {
          const data = {
            lab_group: lab_group_id,
            student: info.id,
          };
          await StudentInLabGroupDataService.postStudentInLabGroups(data);
        }
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      alert("Student Profile has been updated!");
      setSearchResult({});
      setSearchText("");
    }
  };

  const handleConfirmDelete = async (e) => {
    let response = await StudentDataService.deleteStudent(info.id);
    if (response.status === 204) {
      setDeleteProfile(false);
      setSearchResult({});
      setSearchText("");
      alert("Student Profile deleted successfully");
    } else {
      alert("Student Profile has not been deleted!");
    }
  };

  return (
    <div>
      <Form className="my-0 w-100" onSubmit={handleSearch}>
        <h3 className="text-center mb-4">Manage Student Profile</h3>
        <Form.Group controlId="name" className="d-flex">
          <Form.Control
            autoFocus
            type="text"
            placeholder="Search Matriculation Number"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <i className="fas fa-search" />
          </Button>
        </Form.Group>
      </Form>
      <Container className="w-100 mt-3">
        {Object.keys(searchResult).length === 0 ? (
          <Container className="text-center">
            No student profile matched
          </Container>
        ) : (
          <Container className="form p-3">
            <Container className="mb-3 text-center">
              Student profile found
            </Container>
            {loaded ? (
              <Row>
                <Col md={4}>
                  <Image src={info.previewPhoto} className="mb-3" thumbnail />
                  <Form.Label className="text-center">Student Photo</Form.Label>
                  <Form.Control
                    type="file"
                    required
                    onChange={(e) => handleChange("photo", e.target.files[0])}
                    isInvalid={!!errors.photo}
                  />
                  <Form.Control.Feedback type="invalid" className="mt-1">
                    {errors.photo}
                  </Form.Control.Feedback>
                </Col>
                <Col md={8}>
                  <Form className="px-3 d-flex flex-column">
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        autoFocus
                        type="text"
                        required
                        value={info.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="matric">
                      <Form.Label>Matriculation Number</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        value={info.matric || ""}
                        onChange={(e) => handleChange("matric", e.target.value)}
                        isInvalid={!!errors.matric}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.matric}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="group">
                      <Form.Label>Lab Groups</Form.Label>
                      <div className="scroll">
                        {globalLabGroups.map(
                          ({
                            lab_group_id,
                            course_code,
                            course_name,
                            lab_group_name,
                          }) => {
                            return (
                              <Form.Check
                                key={lab_group_id}
                                label={`${course_code}, ${course_name}, ${lab_group_name}`}
                                checked={checkedState[lab_group_id]}
                                onChange={(e) => handleCheckbox(lab_group_id)}
                              />
                            );
                          }
                        )}
                      </div>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                      <Button
                        type="submit"
                        className="w-50 mx-3"
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                      <Button
                        type="submit"
                        variant="danger"
                        className="w-50 mx-3"
                        onClick={(e) => setDeleteProfile(true)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            ) : (
              <Container className="text-center">
                <Spinner animation="border" />
              </Container>
            )}
          </Container>
        )}
      </Container>
      <Modal show={deleteProfile} onHide={handleConfirmDelete} centered>
        <Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this student profile?
          </Modal.Body>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={handleConfirmDelete}>Yes</Button>
          <Button variant="danger" onClick={() => setDeleteProfile(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageStudentProfile;
