import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CreateTAPage from './components/CreateTAPage';
import RegisterStudentPage from './components/RegisterStudentPage';
import { Col, Row } from 'react-bootstrap';
import {Container} from 'react-bootstrap';

function App() {

  const NavbarWithRouter = withRouter(Navbar)
  return (
    <Router>
      <Container>
        <Row>
          <Col sm={2}>
            <NavbarWithRouter />
          </Col>
          <Col className="pt-3">
            <Switch>
              <Route path="/home" component={HomePage} />
              <Route path="/create-ta-account" component={CreateTAPage} />
              <Route path="/register-student" component={RegisterStudentPage} />
          </Switch>
          </Col>
        </Row>
      </Container>
      

    </Router>
  );
}

export default App;
