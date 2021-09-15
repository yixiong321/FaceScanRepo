import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CreateTAPage from "./components/CreateTAPage";
import RegisterStudentPage from "./components/RegisterStudentPage";
import ManageStudentProfile from "./components/ManageStudentProfile";
import { Col, Row } from "react-bootstrap";
import { Container } from "react-bootstrap";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { useState } from "react";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const NavbarWithRouter = withRouter(Navbar);
  const AdminRoutes = () => {
      // if(isAuthorized){
        return (<Container>
          <Row>
            <Col sm={2}>
              <NavbarWithRouter />
            </Col>
            <Col className="pt-3">
                <Route exact path="/home" component={() => <HomePage isAuthorized={isAuthorized} />} />
                <Route path="/create-ta-account" component={CreateTAPage} />
                <Route path="/register-student" component={RegisterStudentPage} />
                <Route
                  path="/manage-student-profile"
                  component={ManageStudentProfile}
                />
            </Col>
          </Row>
        </Container>)
      // }
      // else{
      //   return <hi>You are not authorized to this web page</hi>
      // }
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={() => <LoginPage setIsAuthorized={setIsAuthorized} />} />
        <Route component={AdminRoutes} />
      </Switch>
              
    </Router>
  );
}

export default App;
