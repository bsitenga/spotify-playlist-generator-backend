import React, { useState } from 'react';
import '../../App.css';
import axios from 'axios';

function ChooseMode(props) {
    const [trackInput, setTrackInput] = useState('');
    const [tracks, setTracks] = useState([]);
    const [searched, setSearched] = useState(false);

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
                    })
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log('search error', error.response);
            })
    }

    const handleEnter = (key) => {
        if (key === 'Enter') {
            setSearched(true);
            searchForTrack();
        } else {
            setSearched(false);
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
            {searched ? <div className="search-results">
                search results
            </div> : ''}
            <div className="added-results">
                test
            </div>
        </div>
    </div>
}

export default ChooseMode;
