import React from 'react';
import '../../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import HeroRight from './HeroRight.js';

function Hero() {
	const clientID = 'f0c3aa26b442470db2737973a26efc0a';
	const authEndpoint =
		'https://accounts.spotify.com/authorize' +
		'?response_type=code' +
		'&client_id=' +
		clientID +
		'&redirect_uri=http://localhost:3000/authenticated' + 
		'&scope=playlist-modify-public';;

	return (
		<div className="hero-master-container">
			<Container fluid>
				<Row className="hero-row">
					<Col md={5} className="hero-left">
						<div>
							<h1 className="hero-header">Login to Spotify to create your playlists.</h1>
							<p className="hero-paragraph">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam suscipit risus non nulla
								aliquet vestibulum. Phasellus egestas dolor massa, ut mollis leo tempor interdum.
								Curabitur finibus.
							</p>
							<a href={authEndpoint}>
								<button className="hero-button">
									<i className="fab fa-spotify" /> Login with Spotify hehexd
								</button>
							</a>
						</div>
					</Col>
					<Col md={7}>
						<HeroRight />
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default Hero;
