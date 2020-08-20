import React, { useState } from 'react';
import '../../App.css';

function HeroRight() {
    const [tracks, setTracks] = useState([]);
    const [trackInput, setTrackInput] = useState('');
    const [nextStep, setNextStep] = useState(false);

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
        <div className="hero-right">
            {nextStep ? <h3>Login to Create</h3> : <h3>Choose Up to Five Tracks</h3>}
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
            {nextStep ? <a href={authEndpoint}>
                <button className="hero-button">
                    <i className="fab fa-spotify" /> Login with Spotify hehexd
								</button>
            </a> : <button onClick={() => setNextStep(true)} className="next-step-button">Next Step</button>}

        </div>
    );
}

export default HeroRight;
