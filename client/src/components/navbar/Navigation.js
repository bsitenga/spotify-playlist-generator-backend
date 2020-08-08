import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import '../../App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function Navigation() {
	return (
		<div className="navbar-master-container">
			<Navbar bg="light">
				<Navbar.Brand href="/"><Link to="/">Epic App</Link></Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link href="/FAQ"><Link to="/FAQ">FAQ</Link></Nav.Link>
						<Nav.Link href="/about"><Link to="/about">About</Link></Nav.Link>
						<Nav.Link href="/developers"><Link to="/developers">Developers</Link></Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</div>
	);
}

export default Navigation;
