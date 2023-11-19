import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { NavDropdown } from "react-bootstrap";

const NavBar = () => {
    return(
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/shop">React-Bootstrap</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/store">Store scheme</Nav.Link>
              <NavDropdown title="Administrating" id="basic-nav-dropdown">
              <NavDropdown.Item href="/add">Add Model</NavDropdown.Item>
              <NavDropdown.Item href="~">Add User</NavDropdown.Item>
              <NavDropdown.Item href="/categories/add">Add Category</NavDropdown.Item>
            </NavDropdown>
              <Nav.Link href="/add">Add Item</Nav.Link>
              <Nav.Link href="/delete">Delete Item</Nav.Link>
            </Nav>
        </Container>
      </Navbar>
    );
}
export default NavBar;