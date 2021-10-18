import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { withRouter } from "react-router";
import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CreateTAPage from "./components/CreateTAPage";
import RegisterStudentPage from "./components/RegisterStudentPage";
import ManageStudentProfile from "./components/ManageStudentProfile";
import AttendanceTaking from "./components/AttendanceTaking";
import { NamelistTable } from "./components/Namelist";
import { useGlobalContext } from "./components/Context";
import ErrorPage from "./components/ErrorPage";
import { Col, Row } from "react-bootstrap";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import TADataService from "./service/ta-http";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";

function App() {
  const NavbarWithRouter = withRouter(Navbar);

  const { isAuthorized, setIsAuthorized, isAdmin, setIsAdmin } =
    useGlobalContext();

  const AdminRoutes = () => {
    useEffect(() => {
      const checkIsAdmin = async () => {
        const access = window.localStorage.getItem("access");
        if (access) {
          setIsAuthorized(true);
          const { user_id } = jwt_decode(access);
          const {
            data: { is_superuser },
          } = await TADataService.getAdminById(user_id);
          setIsAdmin(is_superuser);
        }
      };
      checkIsAdmin();
    }, []);

    return isAuthorized ? (
      isAdmin ? (
        <Container>
          <Row>
            <Col sm={2}>
              <NavbarWithRouter />
            </Col>
            <Col className="pt-3">
              <Switch>
                <Route exact path="/home" component={HomePage} />
                <Route path="/create-ta-account" component={CreateTAPage} />
                <Route
                  path="/register-student"
                  component={RegisterStudentPage}
                />
                <Route
                  path="/manage-student-profile"
                  component={ManageStudentProfile}
                />
                <Route path="/session" component={AttendanceTaking} />
                <Route
                  path="/attendance/:sessionid/:labGrp"
                  component={NamelistTable}
                />
                <Route path="*" component={ErrorPage} />
              </Switch>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container>
          <Row>
            <Col sm={2}>
              <NavbarWithRouter />
            </Col>
            <Col className="pt-3">
              <Switch>
                <Route exact path="/home" component={HomePage} />
                <Route path="/session" component={AttendanceTaking} />
                <Route
                  path="/attendance/:sessionid/:labGrp"
                  component={NamelistTable}
                />
                <Route path="*" component={ErrorPage} />
              </Switch>
            </Col>
          </Row>
        </Container>
      )
    ) : (
      <div>You are not authorized to view this web page</div>
    );
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route component={AdminRoutes} />
      </Switch>
    </Router>
  );
}

export default App;
