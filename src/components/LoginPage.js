import { Container, Form, Button, Image } from "react-bootstrap";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const LoginPage = ({ setIsAuthorized }) => {
  let history = useHistory();
  setIsAuthorized(false);

  const initialInfo = {
    username: "",
    password: "",
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
    const { username, password } = info;
    const newErrors = {};
    // check username in database

    // check if password match the account

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // send info to server but password needs to be encrypted (use bcrypt)
      history.push("/home");
      setIsAuthorized(true);
      setInfo(initialInfo);
    }
  };

  return (
    <div className="login-page">
      <Form className=" login-form p-3" onSubmit={handleSubmit}>
        <Container className="text-center mb-5">
          <Image src="facescan-logo.jpg" className="mb-4"/>
          <h3 className="text-white">Welcome to FaceScan</h3>
        </Container>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
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
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={info.password}
            onChange={(e) => handleChange("password", e.target.value)}
            isInvalid={!!errors.password}
            aria-describedby="passwordHelpBlock"
            className="mb-0"
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" className="my-3 w-100">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
