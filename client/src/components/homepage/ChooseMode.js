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
    const [errorMessage, setErrorMessage] = useState("");
    const [songVals, setSongVals] = useState([0, 0, 0, 0, 0, 0]);
    const [acousticness, setAcousticness] = useState(.5);
    const [danceability, setDanceability] = useState(.5);
    const [energy, setEnergy] = useState(.5);
    const [instrumentalness, setInstrumentalness] = useState(.5);
    const [liveness, setLiveness] = useState(.5);
    const [valence, setValence] = useState(.5);

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

    const addTrack = async (trackID, image, name, artist, preview) => {
        if (tracks.length === 10) {
            setErrorMessage("Reached track limit");
            setTrackInput('');
            setSearched(false);
            setSearchResults(false);
        } else {
            let trackArray = tracks;
            trackArray.push({ trackID: trackID, image: image, name: name, artist: artist, preview: preview });
            setTracks(trackArray);

            let tempButtons = playButtons;
            tempButtons.push(0);
            setPlayButtons(tempButtons);

            setTrackInput('');
            setSearched(false);
            setSearchResults(false);

            let trackIDs = "";
            trackIDs += tracks[0].trackID.substring(34, 100);
            let tempVals = songVals;
            for (let i = 1; i < tracks.length; i++) {
                trackIDs += '%2C';
                trackIDs += tracks[i].trackID.substring(34, 100);
            }
            await axios({
                method: 'get',
                url: 'https://api.spotify.com/v1/audio-features?ids=' + trackIDs,
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })
                .then(function (response) {
                    return axios.post('http://localhost:5000/trackdata', {
                        trackObject: response.data
                    })
                        .catch(function (error) {
                            console.log('internal search error', error)
                        })
                })
                .then(function (response) {
                    let averages = response.data;
                    tempVals[0] = averages.averageAcousticness;

                    console.log(songVals);
                })
                .catch(function (error) {
                    console.log('add error', error.response);
                    setSearched(false);
                })
                console.log(tempVals);
            setSongVals(tempVals);
        }
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
                    let preview = searchResults.previews[index];
                    return <div key={index} className='track-result' onClick={() => addTrack(trackID, trackImg, trackName, trackArtist, preview)}>
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
                <p style={{ color: "#777" }}>{errorMessage}</p>
                <h5>Added Tracks</h5>
                <hr className="choose-divider"></hr>
                {tracks.map((item, index) => {
                    return <div key={index} className='added-track'>
                        <img src={item.image} />
                        <span className="added-track-desc">
                            <h4>{item.name.substring(0, 32)}</h4>
                            <p>{item.artist}</p>
                        </span>
                        <audio id={"player" + index} src={item.preview} ></audio>
                        {item.preview ? <button className="play-button" onClick={() => playAudio(index)} >Play/Pause</button> : ""}
                    </div>
                })}
                {tracks[0] ? "" : <p>Add a track!</p>}
            </div>
            <div className="set-filters">
                <h3>Set Filters</h3>
                <hr className="choose-divider"></hr>
                <div className="slider-master">
                    <label for="acousticness-slider">Acousticness - Average Value: {songVals[0].toString().substring(1,4)}</label>
                    <input className="acousticness-slider slider" type="range" min="0" max="100" value={acousticness * 100} onChange={(e) => setAcousticness(e.target.value / 100)}></input>
                    <div className="bound-values">
                        <span className="left-val">0</span>
                        <span className="middle-val">{acousticness.toString().substring(1, 4)}{acousticness === 0 ? 0 : ""}{acousticness === 1 ? 1 : ""}</span>
                        <span className="right-val">1</span>
                    </div>
                </div>
                <div className="slider-master">
                    <label for="danceability-slider">Danceability - Average Value: {songVals[1]}</label>
                    <input className="danceability-slider slider" type="range" min="0" max="100" value={danceability * 100} onChange={(e) => setDanceability(e.target.value / 100)}></input>
                    <div className="bound-values">
                        <span className="left-val">0</span>
                        <span className="middle-val">{danceability.toString().substring(1, 4)}{danceability === 0 ? 0 : ""}{danceability === 1 ? 1 : ""}</span>
                        <span className="right-val">1</span>
                    </div>
                </div>
                <div className="slider-master">
                    <label for="energy-slider">Energy - Average Value: {songVals[2]}</label>
                    <input className="energy-slider slider" type="range" min="0" max="100" value={energy * 100} onChange={(e) => setEnergy(e.target.value / 100)}></input>
                    <div className="bound-values">
                        <span className="left-val">0</span>
                        <span className="middle-val">{energy.toString().substring(1, 4)}{energy === 0 ? 0 : ""}{energy === 1 ? 1 : ""}</span>
                        <span className="right-val">1</span>
                    </div>
                </div>
                <div className="slider-master">
                    <label for="instrumentalness-slider">Instrumentalness - Average Value: {songVals[3]}</label>
                    <input className="instrumentalness-slider slider" type="range" min="0" max="100" value={instrumentalness * 100} onChange={(e) => setInstrumentalness(e.target.value / 100)}></input>
                    <div className="bound-values">
                        <span className="left-val">0</span>
                        <span className="middle-val">{instrumentalness.toString().substring(1, 4)}{instrumentalness === 0 ? 0 : ""}{instrumentalness === 1 ? 1 : ""}</span>
                        <span className="right-val">1</span>
                    </div>
                </div>
                <div className="slider-master">
                    <label for="liveness-slider">Liveness - Average Value: {songVals[4]}</label>
                    <input className="liveness-slider slider" type="range" min="0" max="100" value={liveness * 100} onChange={(e) => setLiveness(e.target.value / 100)}></input>
                    <div className="bound-values">
                        <span className="left-val">0</span>
                        <span className="middle-val">{liveness.toString().substring(1, 4)}{liveness === 0 ? 0 : ""}{liveness === 1 ? 1 : ""}</span>
                        <span className="right-val">1</span>
                    </div>
                </div>
                <div className="slider-master">
                    <label for="valence-slider">Valence - Average Value: {songVals[5]}</label>
                    <input className="valence-slider slider" type="range" min="0" max="100" value={valence * 100} onChange={(e) => setValence(e.target.value / 100)}></input>
                    <div className="bound-values">
                        <span className="left-val">0</span>
                        <span className="middle-val">{valence.toString().substring(1, 4)}{valence === 0 ? 0 : ""}{valence === 1 ? 1 : ""}</span>
                        <span className="right-val">1</span>
                    </div>
                </div>
            </div>
            <button>Generate</button>
        </div>
    </div>
}

export default ChooseMode;
