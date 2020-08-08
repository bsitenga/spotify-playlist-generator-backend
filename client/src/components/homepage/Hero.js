import React, { useState } from 'react';
import '../../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Hero() {
	const [ tracks, setTracks ] = useState([]);
	const [ trackInput, setTrackInput ] = useState('');
	const [ rightTitle, setRightTitle ] = useState('Choose Five Songs');

	const clientID = 'f0c3aa26b442470db2737973a26efc0a';
	const authEndpoint =
		'https://accounts.spotify.com/authorize' +
		'?response_type=code' +
		'&client_id=' +
		clientID +
		'&redirect_uri=http://localhost:3000/authenticated';

	const addTrack = () => {
		if (tracks.length < 5 && trackInput !== '') {
			let trackCopy = tracks;
			let trackObject = { name: trackInput, artist: 'Kanye West', time: '3:10' };
			trackCopy.push(trackObject);
			setTracks(trackCopy);
			setTrackInput('');
		}
	};

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
									<i className="fab fa-spotify" /> Login with Spotify
								</button>
							</a>
						</div>
					</Col>
					<Col md={7}>
						<div className="hero-right">
							<h3>{rightTitle}</h3>
							<input
								placeholder="Track title"
								onChange={(e) => {
									if (tracks.length < 5) {
										setTrackInput(e.target.value);
									}
								}}
								value={trackInput}
							/>
							<button onClick={() => addTrack()}>Add+</button>
							<div>
								<p className="current-track-title">Current tracks</p>
								<hr />
								<div className="current-tracks">
									{tracks.map((item) => {
										return (
											<p>
												{item.name} - {item.artist} - {item.time}
											</p>
										);
									})}
								</div>
							</div>
							<button className="next-step-button">Next Step</button>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default Hero;
