import React, { useState } from 'react';
import '../../App.css';
import axios from 'axios';

function ChooseMode(props) {
    const [trackInput, setTrackInput] = useState('');
    const [tracks, setTracks] = useState([]);

    const accessToken = props.accessToken;

    const searchForTrack = () => {
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
                    })
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log('search error', error.response);
            })
    }

    return <div className="choose-mode-master-container">
        <h3>Choose Songs</h3>
        <input type="text"
            placeholder="Search for a track"
            value={trackInput}
            onChange={e => setTrackInput(e.target.value)}></input>
        <button onClick={() => searchForTrack()}>Search</button>
    </div>
}

export default ChooseMode;
