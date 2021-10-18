import { Navbar, Nav, Container, Image } from "react-bootstrap";
import sidebardata from "../data/sidebardata";
import { useGlobalContext } from "./Context";

const Sidenav = (props) => {
  const { location } = props;
  const { isAdmin } = useGlobalContext();
  return (
    <Navbar fixed="top">
      <Container className="flex-column">
        <Navbar.Brand href="/home">
          <Image src="facescan-logo.jpg" className="mb-3" />
        </Navbar.Brand>
        <Navbar.Text className="text-light">FaceScan</Navbar.Text>
        <Nav
          activeKey={location.pathname}
          defaultActiveKey="/home"
          className="flex-column"
        >
          {sidebardata.map((item, index) => {
            return isAdmin ? (
              <Nav.Link
                key={item.id}
                eventKey={item.link}
                href={item.link}
                className={"text-white py-0 sidenav-color"}
              >
                {item.icon}
                {item.name}
                <div className="underline my-3"></div>
              </Nav.Link>
            ) : (
              <Nav.Link
                key={item.id}
                eventKey={item.link}
                href={item.link}
                className={`text-white py-0 sidenav-color ${
                  index > 0 && "invisible"
                }`}
              >
                {item.icon}
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
