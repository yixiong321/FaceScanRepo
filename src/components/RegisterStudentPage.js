import { Form, Button, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useGlobalContext } from "./Context";
import StudentDataService from "../service/student-http";
import StudentInLabGroupDataService from "../service/student-in-lab-group-http";

const RegisterStudentPage = () => {
  const { globalLabGroups } = useGlobalContext();
  const initialInfo = {
    name: "",
    matric: "",
    photo: {},
    previewPhoto: "default-profile-picture.png",
  };
  const [info, setInfo] = useState(initialInfo);
  const [errors, setErrors] = useState({});
  let initialCheckedState = {};
  globalLabGroups.map(({ lab_group_id }) => {
    return (initialCheckedState[lab_group_id] = false);
  });
  const [checkedState, setCheckedState] = useState(initialCheckedState);

  useEffect(() => {
    console.log(info);
  }, [info]);

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

    if (response && response.photo) {
      newErrors.photo = response.photo[0];
    }

    const fileType = photo["type"];
    if (fileType !== undefined && fileType.split("/")[0] !== "image") {
      newErrors.photo = "Upload only a .png/.jpg/.jpeg file";
    }
    return newErrors;
  };

  const checkAccountInDB = async () => {
    const { name, matric, photo } = info;

    let fd = new FormData();
    fd.append("name", name);
    fd.append("matric", matric);
    fd.append("photo", photo);
    fd.append("type", photo.type);

    try {
      const {
        data: { id },
      } = await StudentDataService.postStudent(fd);

      for (const lab_group_id in checkedState) {
        if (checkedState[lab_group_id]) {
          const data = {
            lab_group: lab_group_id,
            student: id,
          };
          await StudentInLabGroupDataService.postStudentInLabGroups(data);
        }
      }
    } catch (e) {
      return e.response?.data;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = await findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      alert("New student profile successfully created!");
      setInfo(initialInfo);
      setCheckedState(initialCheckedState);
      document.getElementById("photo").value = null;
    }
  };

  return (
    <Form className="form w-50" onSubmit={handleSubmit}>
      <h3 className="text-center">Register Student</h3>
      <Form.Group className="mb-4" controlId="name">
        <Form.Label>Name*</Form.Label>
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
      <Form.Group className="mb-4" controlId="matric">
        <Form.Label>Matriculation Number*</Form.Label>
        <Form.Control
          type="text"
          required
          value={info.matric}
          onChange={(e) => handleChange("matric", e.target.value)}
          isInvalid={!!errors.matric}
        />
        <Form.Control.Feedback type="invalid">
          {errors.matric}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-4" controlId="photo">
        <Form.Label>Student Photo*</Form.Label>
        <div>
          <Image src={info.previewPhoto} className="w-50 h-75 mb-3" thumbnail />
        </div>
        <Form.Control
          type="file"
          required
          onChange={(e) => handleChange("photo", e.target.files[0])}
          isInvalid={!!errors.photo}
        />
        <Form.Control.Feedback type="invalid" className="pt-3">
          {errors.photo}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4" controlId="group">
        <Form.Label>Lab Groups</Form.Label>
        <div className="scroll">
          {globalLabGroups.map(
            ({ lab_group_id, course_code, course_name, lab_group_name }) => {
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
      <Button type="submit" className="mb-4 w-100">
        Create Student Profile
      </Button>
    </Form>
  );
};

export default RegisterStudentPage;
