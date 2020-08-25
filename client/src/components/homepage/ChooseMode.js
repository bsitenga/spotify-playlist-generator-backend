import React, { useState } from 'react';
import '../../App.css';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

function ChooseMode(props) {
    const [trackInput, setTrackInput] = useState('');
    const [tracks, setTracks] = useState([]);
    const [searched, setSearched] = useState(false);
    const [searchResults, setSearchResults] = useState(false);

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
                setSearchResults(response.data);
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
            setSearchResults(false);
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
            {searched ? <div className="search-results" style={searchResults ? {textAlign: 'left'} : {textAlign: 'center'}} >
                {searchResults ? <div>{searchResults.trackIDs.map((trackID, index) => {
                    return <div key={index} className='track-result'>
                        <img src={searchResults.images[index]} />
                        <span className="track-desc">
                            <h4>{searchResults.name[index].substring(0,40)}</h4>
                            <p>{searchResults.artists[index]}</p>
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
                test
            </div>
        </div>
    </div>
}

export default ChooseMode;
