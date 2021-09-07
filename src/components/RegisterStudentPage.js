import { Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import groups from "../data/groups";

const RegisterStudentPage = () => {
  const firstGroup = groups[0];
  const initialInfo = {
    name: "",
    matric_number: "",
    picture: {},
    group: `${firstGroup.course_code}, ${firstGroup.index}, ${firstGroup.lab_group}`,
  };
  const [info, setInfo] = useState(initialInfo);
  const [errors, setErrors] = useState({});

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
    const { name, matric_number } = info;
    const newErrors = {};
    // check matric_number in database

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      alert("New student profile successfully created!");
      // need to check the index of the lab group chosen
      // process file
      // send info to server
      setInfo(initialInfo);
      document.getElementById('picture').value = null
    }
  };

  return (
    <Container>
      <Form className="form p-3" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            required
            value={info.name}
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
            value={info.matric_number}
            onChange={(e) => handleChange("matric_number", e.target.value)}
            isInvalid={!!errors.matric_number}
          />
          <Form.Control.Feedback type="invalid">
            {errors.matric_number}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="picture">
          <Form.Label>Student Picture</Form.Label>
          <Form.Control
            type="file"
            required
            onChange={(e) => handleChange("picture", e.target.files[0])}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="group">
          <Form.Label>Lab Group</Form.Label>
          <Form.Control
            as="select"
            required
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
        <Button variant="primary" type="submit" className="mb-3 w-100">
          Create Student Profile
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterStudentPage;
