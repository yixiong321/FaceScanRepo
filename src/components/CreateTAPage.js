import { Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import TADataService from "../service/ta-http";

const CreateTAPage = (props) => {
  const initialInfo = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const findFormErrors = async () => {
    const { password, confirmPassword } = info;
    const newErrors = {};
    const response = await checkAccountInDB();

    if (response && response.username) {
      newErrors.username = response.username[0];
    }

    if (
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      )
    ) {
      newErrors.password = "Password does not meet requirements!";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    } else if (response && response.password) {
      newErrors.password = response.password[0];
    }
    return newErrors;
  };

  const checkAccountInDB = async () => {
    const { username, password, email } = info;
    const data = {
      is_superuser: "false",
      username,
      password,
      email,
    };
    try {
      await TADataService.postTA(data);
    } catch (e) {
      return e.response.data;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = await findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      alert("New TA account successfully created!");
      setInfo(initialInfo);
    }
  };

  return (
    <Container>
      <Form className="form my-0 w-50" onSubmit={handleSubmit}>
        <h3 className="text-center">Create TA Account</h3>
        <Form.Group className="mb-4" controlId="username">
          <Form.Label>Username*</Form.Label>
          <Form.Control
            autoFocus
            type="username"
            required
            value={info.username}
            onChange={(e) => handleChange("username", e.target.value)}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">
            {errors.username}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4" controlId="email">
          <Form.Label>Email*</Form.Label>
          <Form.Control
            type="email"
            required
            value={info.email}
            onChange={(e) => handleChange("email", e.target.value)}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Password*</Form.Label>
          <Form.Control
            type="password"
            required
            value={info.password}
            onChange={(e) => handleChange("password", e.target.value)}
            isInvalid={!!errors.password}
            aria-describedby="passwordHelpBlock"
            className="mb-0"
          />
          <div className="mb-2">
            <Form.Text id="passwordHelpBlock" className="text-muted">
              Password must consists at least one uppercase letter, one lower
              case letter, one digit, one special character and minimum 8
              characters in length
            </Form.Text>
          </div>
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4" controlId="confirmPassword">
          <Form.Label>Confirm Password*</Form.Label>
          <Form.Control
            type="password"
            required
            value={info.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            isInvalid={!!errors.confirmPassword}
            aria-describedby="passwordHelpBlock"
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" className="my-3 w-100">
          Create TA Account
        </Button>
      </Form>
    </Container>
  );
};

export default CreateTAPage;