import React from 'react';
import '../../App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navigation() {
	return (
		<div className="navbar-master-container">
			<Navbar bg="light" expand="lg">
				<Navbar.Brand href="#home">Epic App</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link href="#home">FAQ</Nav.Link>
						<Nav.Link href="#link">About</Nav.Link>
						<Nav.Link href="#link">Developers</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</div>
	);
}

export default Navigation;
