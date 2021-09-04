import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CreateTAPage from './components/CreateTAPage';
import RegisterStudentPage from './components/RegisterStudentPage';

function App() {

  const NavbarWithRouter = withRouter(Navbar)
  return (
    <Router>
      <NavbarWithRouter />
      <Switch>
        <Route path="/home" component={HomePage} />
        <Route path="/create-ta-account" component={CreateTAPage} />
        <Route path="/register-student" component={RegisterStudentPage} />
      </Switch>
    </Router>
  );
}

export default App;
