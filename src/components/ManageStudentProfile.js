import { Container, Form, Button, Row, Col, Image, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import students from "../data/students";
import groups from "../data/groups";

const ManageStudentProfile = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState({});
  const initialInfo = {
    name: "",
    matric_number: "",
    picture: {},
    group: "",
  };
  const [info, setInfo] = useState(initialInfo);
  const [errors, setErrors] = useState({});
  const [deleteProfile, setDeleteProfile] = useState(false);

  useEffect(() => {
    const { name, matric_number, picture, group } = searchResult;
    setInfo({ name, matric_number, picture, group });
  }, [searchResult]);

  const handleSearch = (e) => {
    e.preventDefault();
    //search db for student profile
    let studentProfile = students.filter(
      (student) =>
        student.matric_number.toLowerCase() === searchText.toLowerCase()
    );
    if (studentProfile[0] && Object.keys(studentProfile[0]).length !== 0) {
      setSearchResult(studentProfile[0]);
    } else {
      setSearchResult({});
    }
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
  };

  const findFormErrors = () => {
    const { matric_number, picture } = info;
    const newErrors = {};
    // check matric_number in database
    const fileType = picture['type']
    if (fileType !== undefined && fileType.split('/')[0] !== "image") {
      newErrors.picture = "Upload only a .png/.jpg/.jpeg file";
    }

    return newErrors;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      alert("Student Profile has been updated!");
      // need to check the index of the lab group chosen
      // process file
      // send info to server
      setSearchResult({});
      setSearchText("");
    }
  };

  const handleConfirmDelete = (e) => {
    //delete student profile from database
    setDeleteProfile(false)
    setSearchResult({});
    setSearchText("");
  }

  return (
    <Container>
      <Form className="form my-0 w-75" onSubmit={handleSearch}>
        <h1 className="text-center mb-4">Manage Student Profile</h1>
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
      <Container className="w-75 mt-3">
        {Object.keys(searchResult).length === 0 ? (
          <Container className="text-center">
            No student profile matched
          </Container>
        ) : (
          <Container className="form p-3">
            <Container className="mb-3 text-center">
              Student profile found
              <button className="btn-danger btn-circle float-end" onClick={(e) => setDeleteProfile(true)}>
                <i className="fas fa-trash" />
              </button>
            </Container>
            <Row>
              <Col md={4}>
                <Image
                  src={
                    info.picture instanceof File
                      ? window.URL.createObjectURL(
                          new Blob([info.picture], {
                            type: "image/png",
                          })
                        )
                      : "default-profile-picture.png"
                  }
                  fluid
                  thumbnail
                />
                <Form.Label className="text-center">Student Picture</Form.Label>
                <Form.Control
                  type="file"
                  required
                  onChange={(e) => handleChange("picture", e.target.files[0])}
                  isInvalid={!!errors.picture}
                />
                <Form.Control.Feedback type="invalid" className="mt-1">
                  {errors.picture}
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
                  <Form.Group className="mb-3" controlId="matric_number">
                    <Form.Label>Matriculation Number</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={info.matric_number || ""}
                      onChange={(e) =>
                        handleChange("matric_number", e.target.value)
                      }
                      isInvalid={!!errors.matric_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.matric_number}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="group">
                    <Form.Label>Lab Group</Form.Label>
                    <Form.Control
                      as="select"
                      className="form-select"
                      required
                      value={info.group || ""}
                      onChange={(e) => handleChange("group", e.target.value)}
                    >
                      {groups.map((group) => {
                        return (
                          <option key={group.id}>
                            {`${group.course_code}, ${group.index}, ${group.lab_group}`}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                  <Button type="submit" onClick={handleSave}>
                    Save
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        )}
      </Container>
      <Modal show={deleteProfile} onHide={handleConfirmDelete} centered>
        <Modal.Header>
          <Modal.Body>Are you sure you want to delete this student profile?</Modal.Body>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={handleConfirmDelete}>
            Yes
          </Button>
          <Button variant="danger" onClick={() => setDeleteProfile(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageStudentProfile;
