import { Container, Form, Button, Image } from "react-bootstrap";
import { useState, useMemo, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoginDataService from "../service/login-http";
import { useGlobalContext } from "./Context";

const LoginPage = () => {
  let history = useHistory();
  const { setIsAuthorized } = useGlobalContext();

  useEffect(() => {
    return () => setIsAuthorized(false);
  }, [])
  const initialInfo = useMemo(() => {
    return {
      username: "",
      password: "",
    };
  }, []);

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
    const newErrors = {};
    const response = await checkAccountInDB();

    if (response && response.detail) {
      newErrors.password = response.detail;
    }
    return newErrors;
  };

  const checkAccountInDB = async () => {
    try {
      const { username, password } = info;
      const {
        data: { refresh, access },
      } = await LoginDataService.postToken({ username, password });
      if (refresh && access) {
        window.localStorage.setItem("refresh", refresh);
        window.localStorage.setItem("access", access);
        setInfo(initialInfo);
        history.push("/home");
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
    }
  };

  return (
    <div className="login-page d-flex align-items-centers">
      <Container className="login-box d-flex justify-content-center align-items-center">
        <Container className="logo-box d-flex flex-column justify-content-center align-items-center w-100 h-100">
          <Image src="facescan-logo.jpg" className="mb-4" />
          <h3 className="text-light">FaceScan</h3>
        </Container>
        <Form
          className="form-box d-flex flex-column justify-content-center p-4 w-100 h-100"
          onSubmit={handleSubmit}
          data-testid="login-form"
        >
          <h4 className="mb-4">Login to Dashboard</h4>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              type="username"
              required
              value={info.username}
              onChange={(e) => handleChange("username", e.target.value)}
              isInvalid={!!errors.username}
              data-testid="login-page-username"
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
              data-testid="login-page-password"
            />
            <Form.Control.Feedback type="invalid" className="pt-3" data-testid="login-error-message">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="my-3 w-100" data-testid="login-button">
            Login
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default LoginPage;
