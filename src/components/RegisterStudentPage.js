import { Container, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useGlobalContext } from "./Context";
import StudentDataService from "../service/student-http"

const RegisterStudentPage = () => {
  const { globalLabGroups } = useGlobalContext();
  let labGroups = globalLabGroups;
  const { lab_group_id, course_code, course_name, lab_group_name } =
    labGroups[0];
  const initialInfo = {
    name: "",
    matric_number: "",
    picture: {},
    group: `${lab_group_id}, ${course_code}, ${course_name}, ${lab_group_name}`,
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

  const findFormErrors = async() => {
    const { matric_number, picture } = info;
    const newErrors = {};
    // check matric_number in database
    const response = await checkAccountInDB()
    if(response === "matric"){
      newErrors.username = "Matriculation Number already exists!"
    }

    const fileType = picture['type']
    if (fileType !== undefined && fileType.split('/')[0] !== "image") {
      newErrors.picture = "Upload only a .png/.jpg/.jpeg file";
    }
    return newErrors;
  };

  const checkAccountInDB = async () => {
    const { name, matric_number, picture } = info;
    const formData = new FormData()
    console.log(picture);
    // formData.append('picture', picture, picture.name)
    const data = {
      name,
      matric_number,
      formData,
    };
    
    try {
      await StudentDataService.postStudent(data);
    } catch (e) {
      if (e.response.data.matric) return "matric";
    }
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
      document.getElementById("picture").value = null;
    }
  };

  return (
    <Container>
      <Form className="form w-75" onSubmit={handleSubmit}>
        <h1 className="text-center mb-3">Register Student</h1>
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
            className="form-select"
            required
            onChange={(e) => handleChange("group", e.target.value)}
          >
            {labGroups.map(
              ({ lab_group_id, course_code, course_name, lab_group_name }) => {
                return (
                  <option key={lab_group_id}>
                    {`${lab_group_id}, ${course_code}, ${course_name}, ${lab_group_name}`}
                  </option>
                );
              }
            )}
          </Form.Control>
        </Form.Group>
        <Button type="submit" className="mb-3 w-100">
          Create Student Profile
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterStudentPage;
