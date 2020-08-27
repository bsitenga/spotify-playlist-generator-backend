import React, { useState } from 'react';
import '../../App.css';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

function ChooseMode(props) {
    const [trackInput, setTrackInput] = useState('');
    const [tracks, setTracks] = useState([]);
    const [searched, setSearched] = useState(false);
    const [searchResults, setSearchResults] = useState(false);
    const [playButtons, setPlayButtons] = useState([]);
    const [playIndices, setPlayIndices] = useState([]);

    const accessToken = props.accessToken;

    const searchForTrack = () => {
        setSearched(true);
        let searchString = trackInput.replace(" ", "%20")
        axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/search?q=' + searchString + '&type=track&limit=5',
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then(function (response) {
                return axios.post('http://localhost:5000/search', {
                    searchObject: response.data
                })
                    .catch(function (error) {
                        console.log('internal search error', error)
                        setSearched(false);
                    })
            })
            .then(function (response) {
                console.log(response);
                setSearchResults(response.data);
            })
            .catch(function (error) {
                console.log('search error', error.response);
                setSearched(false);
            })
    }

    const handleEnter = (key) => {
        if (key === 'Enter') {
            setSearched(true);
            searchForTrack();
        } else {
            setSearched(false);
            setSearchResults(false);
        }
    }

    const addTrack = (trackID, image, name, artist) => {
        let trackArray = tracks;
        trackArray.push({ trackID: trackID, image: image, name: name, artist: artist });
        setTracks(trackArray);

        let tempButtons = playButtons;
        tempButtons.push(0);
        setPlayButtons(tempButtons);

        setTrackInput('');
        setSearched(false);
        setSearchResults(false);
    }

    const playAudio = (index) => {
        if (playButtons[index]) {
            document.getElementById('player' + index).pause();
            let tempButtons = playButtons;
            tempButtons[index] = 0;
            setPlayButtons(tempButtons);
        } else {
            document.getElementById('player' + index).play();
            let tempButtons = playButtons;
            tempButtons[index] = 1;
            setPlayButtons(tempButtons);
        }
    }

    return <div className="choose-mode-master-container">
        <div className="search-area">
            <input type="text"
                placeholder="Search for a track"
                value={trackInput}
                className="track-search"
                onKeyDown={e => handleEnter(e.key)}
                onChange={e => setTrackInput(e.target.value)}></input>
            <button onClick={() => searchForTrack()} className="search-area-button">Search</button>
            {searched ? <div className="search-results" style={searchResults ? { textAlign: 'left' } : { textAlign: 'center' }} >
                {searchResults ? <div>{searchResults.trackIDs.map((trackID, index) => {
                    let trackImg = searchResults.images[index];
                    let trackName = searchResults.name[index];
                    let trackArtist = searchResults.artists[index];
                    return <div key={index} className='track-result' onClick={() => addTrack(trackID, trackImg, trackName, trackArtist)}>
                        <img src={trackImg} />
                        <span className="track-desc">
                            <h4>{trackName.substring(0, 40)}</h4>
                            <p>{trackArtist}</p>
                        </span>
                        <span className="add-track">
                            Add+
                        </span>
                    </div>
                })}</div>
                    :
                    <Spinner style={{ color: '#1db954', margin: '2vh auto 2vh' }} animation="border" role="status"></Spinner>}
            </div> : ''}
            <div className="added-results">
                <h5>Added Tracks</h5>
                {tracks.map((item, index) => {
                    return <div key={index} className='added-track'>
                        <img src={item.image} />
                        <span className="added-track-desc">
                            <h4>{item.name.substring(0, 40)}</h4>
                            <p>{item.artist}</p>
                        </span>
                        <audio id={"player" + index} src="https://p.scdn.co/mp3-preview/baea5e2b5a7315322edb8fade9bb8deacc97b436?cid=774b29d4f13844c495f206cafdad9c86" ></audio>
                        <button onClick={() => playAudio(index)} >Play/Pause</button>
                    </div>
                })}
            </div>
            <div className="set-filters">
                Set Filters
            </div>
            <button>Generate</button>
        </div>
    </div>
}

export default ChooseMode;
