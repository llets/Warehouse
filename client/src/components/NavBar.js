import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

const NavBar = () => {
    return(
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/shop">React-Bootstrap</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/store">Store scheme</Nav.Link>
              <Nav.Link href="/add">Add Item</Nav.Link>
              <Nav.Link href="/delete">Delete Item</Nav.Link>
            </Nav>
        </Container>
      </Navbar>
    );
}
export default NavBar;