import React, { useState } from 'react';
import '../../App.css';

function HeroRight() {
    const [ tracks, setTracks ] = useState([]);
	const [ trackInput, setTrackInput ] = useState('');
	const [ rightTitle, setRightTitle ] = useState('Choose Five Tracks');

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
    );
}

export default HeroRight;
