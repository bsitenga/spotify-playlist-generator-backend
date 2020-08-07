import React, { useState } from 'react';
import '../../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Hero() {
	const [ tracks, setTracks ] = useState([]);
	const [ trackInput, setTrackInput ] = useState('');

	const addTrack = () => {
		let trackCopy = tracks;
		let trackObject = { name: trackInput, artist: 'Kanye West' };
		trackCopy.push(trackObject);
		setTracks(trackCopy);
		setTrackInput('');
	};

	return (
		<div className="hero-master-container">
			<Container fluid>
				<Row className="hero-row">
					<Col md={5} className="hero-left">
						<div>
							<h1 className="hero-header">Login to Spotify to save your playlists.</h1>
							<p className="hero-paragraph">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam suscipit risus non nulla
								aliquet vestibulum. Phasellus egestas dolor massa, ut mollis leo tempor interdum.
								Curabitur finibus.
							</p>
							<button className="hero-button">
								<i class="fab fa-spotify" />{' '}
								Login with Spotify
							</button>
						</div>
					</Col>
					<Col md={7}>
						<div className="hero-right">
							<h3>Generate a playlist</h3>
							<input
								placeholder="Track title"
								onChange={(e) => {
									setTrackInput(e.target.value);
								}}
								value={trackInput}
							/>
							<button onClick={() => addTrack()}>Add+</button>
							<div>
								<p>Current tracks</p>
								<div className="current-tracks">
									{tracks.map((item) => {
										return (
											<p>
												{item.name} - {item.artist}
											</p>
										);
									})}
								</div>
							</div>
							<button>Next Step</button>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default Hero;
