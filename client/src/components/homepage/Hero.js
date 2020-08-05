import React from 'react';
import '../../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Hero() {
	return (
		<div className="hero-master-container">
			<Container fluid>
				<Row className="hero-row">
					<Col md={5} className="hero-left">
						<div>
							<h1 className="hero-header">Log in to Spotify to save your playlists.</h1>
              <p className="hero-paragraph">stuff</p>
              <button className="hero-button">Login with Spotify</button>
            </div>
					</Col>
					<Col md={7}>col 2</Col>
				</Row>
			</Container>
		</div>
	);
}

export default Hero;
