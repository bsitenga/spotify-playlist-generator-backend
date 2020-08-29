import React, { useState } from 'react';
import '../../App.css';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import qs from 'qs';

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
    const [finished, setFinished] = useState(false);
    const [numSongs, setNumSongs] = useState(50);

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
                    tempVals[1] = averages.averageDanceability;
                    tempVals[2] = averages.averageEnergy;
                    tempVals[3] = averages.averageInstrumentalness;
                    tempVals[4] = averages.averageLiveness;
                    tempVals[5] = averages.averageValence;
                })
                .catch(function (error) {
                    console.log('add error', error.response);
                    setSearched(false);
                })
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

    const convertFeature = (feature) => {
        let str = feature.toString();
        if (str.length === 1 || str.length === 2) {
            return feature;
        }
        return feature.toString().substring(1, 4);
    }

    const generatePlaylist = async () => {
        let seedTracks = "";
        seedTracks += tracks[0].trackID.substring(34, 100);
        for (let i = 1; i < tracks.length; i++) {
            seedTracks += '%2C';
            seedTracks += tracks[i].trackID.substring(34, 100);
        }
        let tAcousticness = convertFeature(acousticness);
        let tDanceabililty = convertFeature(danceability);
        let tEnergy = convertFeature(energy);
        let tInstrumentalness = convertFeature(instrumentalness);
        let tLiveness = convertFeature(liveness);
        let tValence = convertFeature(valence);
        let playlistString = "https://api.spotify.com/v1/recommendations?limit=" + numSongs + "&market=US" +
            "&seed_tracks=" + seedTracks +
            "&target_acousticness=" + tAcousticness +
            "&target_danceability=" + tDanceabililty +
            "&target_energy=" + tEnergy +
            "&target_instrumentalness=" + tInstrumentalness +
            "&target_liveness=" + tLiveness +
            "&min_popularity=50" +
            "&target_valence=" + tValence;
        axios({
            method: 'get',
            url: playlistString,
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then(function (response) {
                return axios.post('http://localhost:5000/recommendations', {
                    recObject: response.data,
                    numSongs: numSongs
                })
                    .catch(function (error) {
                        console.log('internal recommendation error', error)
                    })
            })
            .then(function (response) {
                let recArray = response.data;
                let recString = recArray[0].replace(':', '%3A');
                for (let i = 1; i < recArray.length; i++) {
                    recString += '%2C';
                    recString += recArray[i].replace(':', '%3A');
                }
                axios({
                    method: 'get',
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        Authorization: "Bearer " + accessToken
                    }
                })
                    .then(function (response) {
                        let userID = response.data.id;
                        axios({
                            method: 'post',
                            url: 'https://api.spotify.com/v1/users/' + userID + '/playlists',
                            data: { "name": "Generated Playlist", "description": "Generated Playlist", "public": "true" },
                            headers: {
                                Authorization: "Bearer " + accessToken,
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        })
                            .then(function (response) {
                                let playlistID = response.data.id;
                                let playlistUrl = response.data.external_urls.spotify;
                                let addUrl = 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks?uris=' + recString;
                                axios({
                                    method: 'post',
                                    url: addUrl,
                                    data: {},
                                    headers: {
                                        Authorization: "Bearer " + accessToken,
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    }
                                })
                                    .then(function (response) {
                                        console.log(playlistUrl);
                                    })
                                    .catch(function (error) {
                                        console.log('add item error', error);
                                    })
                            })
                            .catch(function (error) {
                                console.log('create playlist error', error)
                                console.log(error.response);
                            })
                    })
                    .catch(function (error) {
                        console.log('get user error', error)
                    })
            })
            .catch(function (error) {
                console.log('recommendation error', error.response);
            })
            .finally(function () {
                console.log('finished');
            })
    }

    return <div className="choose-mode-master-container">
        <div className="ungenerated-area">
            {!finished ?
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
                        {tracks[0] ? <button onClick={() => setFinished(true)}>Finished</button> : <p>Add a track!</p>}
                    </div>
                </div> : ""}
            {finished ?
                <div className="set-filters">
                    <h3>Set Filters</h3>
                    <hr className="choose-divider"></hr>
                    <div className="slider-master">
                        <label htmlFor="acousticness-slider">Acousticness - Average Value: {finished ? songVals[0].toString().substring(1, 4) : ""}</label>
                        <input className="acousticness-slider slider" type="range" min="0" max="100" value={acousticness * 100} onChange={(e) => setAcousticness(e.target.value / 100)}></input>
                        <div className="bound-values">
                            <span className="left-val">0</span>
                            <span className="middle-val">{acousticness.toString().substring(1, 4)}{acousticness === 0 ? 0 : ""}{acousticness === 1 ? 1 : ""}</span>
                            <span className="right-val">1</span>
                        </div>
                    </div>
                    <div className="slider-master">
                        <label htmlFor="danceability-slider">Danceability - Average Value: {finished ? songVals[1].toString().substring(1, 4) : ""}</label>
                        <input className="danceability-slider slider" type="range" min="0" max="100" value={danceability * 100} onChange={(e) => setDanceability(e.target.value / 100)}></input>
                        <div className="bound-values">
                            <span className="left-val">0</span>
                            <span className="middle-val">{danceability.toString().substring(1, 4)}{danceability === 0 ? 0 : ""}{danceability === 1 ? 1 : ""}</span>
                            <span className="right-val">1</span>
                        </div>
                    </div>
                    <div className="slider-master">
                        <label htmlFor="energy-slider">Energy - Average Value: {finished ? songVals[2].toString().substring(1, 4) : ""}</label>
                        <input className="energy-slider slider" type="range" min="0" max="100" value={energy * 100} onChange={(e) => setEnergy(e.target.value / 100)}></input>
                        <div className="bound-values">
                            <span className="left-val">0</span>
                            <span className="middle-val">{energy.toString().substring(1, 4)}{energy === 0 ? 0 : ""}{energy === 1 ? 1 : ""}</span>
                            <span className="right-val">1</span>
                        </div>
                    </div>
                    <div className="slider-master">
                        <label htmlFor="instrumentalness-slider">Instrumentalness - Average Value: {finished ? songVals[3].toString().substring(1, 4) : ""}</label>
                        <input className="instrumentalness-slider slider" type="range" min="0" max="100" value={instrumentalness * 100} onChange={(e) => setInstrumentalness(e.target.value / 100)}></input>
                        <div className="bound-values">
                            <span className="left-val">0</span>
                            <span className="middle-val">{instrumentalness.toString().substring(1, 4)}{instrumentalness === 0 ? 0 : ""}{instrumentalness === 1 ? 1 : ""}</span>
                            <span className="right-val">1</span>
                        </div>
                    </div>
                    <div className="slider-master">
                        <label htmlFor="liveness-slider">Liveness - Average Value: {finished ? songVals[4].toString().substring(1, 4) : ""}</label>
                        <input className="liveness-slider slider" type="range" min="0" max="100" value={liveness * 100} onChange={(e) => setLiveness(e.target.value / 100)}></input>
                        <div className="bound-values">
                            <span className="left-val">0</span>
                            <span className="middle-val">{liveness.toString().substring(1, 4)}{liveness === 0 ? 0 : ""}{liveness === 1 ? 1 : ""}</span>
                            <span className="right-val">1</span>
                        </div>
                    </div>
                    <div className="slider-master">
                        <label htmlFor="valence-slider">Valence - Average Value: {finished ? songVals[5].toString().substring(1, 4) : ""}</label>
                        <input className="valence-slider slider" type="range" min="0" max="100" value={valence * 100} onChange={(e) => setValence(e.target.value / 100)}></input>
                        <div className="bound-values">
                            <span className="left-val">0</span>
                            <span className="middle-val">{valence.toString().substring(1, 4)}{valence === 0 ? 0 : ""}{valence === 1 ? 1 : ""}</span>
                            <span className="right-val">1</span>
                        </div>
                    </div>
                    <div className="slider-master">
                        <label htmlFor="songs-slider">Number of Songs</label>
                        <input className="song-slider slider" type="range" min="1" max="100" value={numSongs} onChange={(e) => setNumSongs(e.target.value)}></input>
                        <div className="bound-values">
                            <span className="left-val">1</span>
                            <span className="middle-val">{numSongs}</span>
                            <span className="right-val">100</span>
                        </div>
                    </div>
                    <button onClick={() => generatePlaylist()}>Generate</button>
                </div>
                : ""}
        </div>
    </div>
}

export default ChooseMode;
