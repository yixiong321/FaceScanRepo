import { Navbar, Nav, Container, Image } from "react-bootstrap";
import sidebardata from "../data/sidebardata";

const Sidenav = (props) => {
  const { location } = props;
  return (
    <Navbar fixed="top">
      <Container className="flex-column">
        <Navbar.Brand href="/home">
          <Image src="facescanlogo.png" roundedCircle />
        </Navbar.Brand>
        <Navbar.Text className="text-light">FACESCAN</Navbar.Text>
        <Nav activeKey={location.pathname} defaultActiveKey="/home" className="flex-column">
          {sidebardata.map((item) => {
            return (
              <Nav.Link key={item.id} eventKey={item.link} href={item.link} className="text-muted py-0 sidenav-color">
                {item.name}
                <div className="underline my-3"></div>
              </Nav.Link>
            );
          })}
          </Nav>
      </Container>
    </Navbar>
  );
};

export default Sidenav;
