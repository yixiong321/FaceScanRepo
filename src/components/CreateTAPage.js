import { Container, Form, Button } from "react-bootstrap";
import { useState } from "react";

const CreateTAPage = (props) => {
  const initialInfo = {
    username: "",
    email: "",
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
    const { username, email, password } = info;
    const newErrors = {};
    // check username in database

    // check email in database

    if (
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      )
    ) {
      newErrors.password = "Password does not meet requirements!";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      alert("New TA account successfully created!");
      // send info to server but password needs to be encrypted (use bcrypt)
      setInfo(initialInfo);
    }
  };

  return (
    <Container className="resize-content">
      <Form className="form p-3" onSubmit={handleSubmit}>
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
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
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
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={info.password}
            onChange={(e) => handleChange("password", e.target.value)}
            isInvalid={!!errors.password}
            aria-describedby="passwordHelpBlock"
          />
          <Form.Text id="passwordHelpBlock" muted>
            Password must consists at least one uppercase letter, one lower case
            letter, one digit, one special character and minimum 8 characters in
            length
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" className="mb-3 w-100">
          Create TA Account
        </Button>
      </Form>
    </Container>
  );
};

export default CreateTAPage;
