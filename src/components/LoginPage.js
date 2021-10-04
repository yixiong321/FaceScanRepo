import { Container, Form, Button, Image } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import LoginDataService from "../service/login-http";

const LoginPage = ({ setIsAuthorized }) => {
  let history = useHistory();
  setIsAuthorized(false);

  const initialInfo = useMemo(() => {
    return {
      username: "",
      password: "",
    };
  }, []);

  const [info, setInfo] = useState(initialInfo);
  const [errors, setErrors] = useState({});
  const [auth, setAuth] = useState(false);

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
        history.push("/home");
        setIsAuthorized(true);
        setInfo(initialInfo);
      }
    } catch (e) {
      return e.response?.data;
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newErrors = await findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setAuth(true);
    }
  };

  return (
    <div className="login-page">
      <Form className=" login-form p-3" onSubmit={handleSubmit}>
        <Container className="text-center mb-5">
          <Image src="facescan-logo.jpg" className="mb-4" />
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
          <Form.Control.Feedback type="invalid" className="pt-3">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="my-3 w-100"
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;