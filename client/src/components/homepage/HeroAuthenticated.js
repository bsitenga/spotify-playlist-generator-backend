import React, { useEffect, useState } from 'react';
import '../../App.css';
import axios from 'axios';
import qs from 'qs';
import ReactSearchBox from 'react-search-box'

function HeroAuthenticated() {
  const [accessToken, setAccessToken] = useState('');
  const [trackInput, setTrackInput] = useState('');
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    let code = getParams(window.location.href).code;
    if (code) {
      axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: 'http://localhost:3000/authenticated',
          client_id: 'f0c3aa26b442470db2737973a26efc0a',
          client_secret: '08760bf9ddcb40a199d1419291a73942'
        },
        data: qs.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: 'http://localhost:3000/authenticated',
          client_id: 'f0c3aa26b442470db2737973a26efc0a',
          client_secret: '08760bf9ddcb40a199d1419291a73942'
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
        .then(function (response) {
          setAccessToken(response.data.access_token);
          console.log(response);
        })
        .catch(function (error) {
          console.log("post error:", error.response)
        })
    } else {
      // TODO: replace url with final url after deploying
      window.location.replace("http://localhost:3000")
    }
  }, [])

  const getParams = (url) => {
    let params = {};
    let parser = document.createElement('a');
    parser.href = url;
    let query = parser.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  }

  const searchForTrack = () => {
    let searchString = trackInput.replace(" ", "%20")
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/search?q=' + searchString + '&type=track&limit=5',
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })
    .then(function(response) {
      return axios.post('http://localhost:5000/search', {
        searchObject: response.data
      })
      .catch(function(error) {
        console.log('internal search error', error)
      })
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log('search error', error.response);
    })
  }

  const AuthenticatedTokenPage = () => {
    return <div className="authenticated-token-page">
      <h3>Choose Up to Five Songs</h3>
      <ReactSearchBox
        placeholder="Search for a track or artist"
        value={trackInput}
        data={tracks}
        onChange={e => setTrackInput(e)}
        callback={record => console.log(record)}
      />
      <button onClick={() => searchForTrack()}>Search</button>
    </div>
  }

  const LoadingError = () => {
    return <div className="loading-page">
      Authentication error
      Please sign in again
    </div>
  }

  return (
    <div className="hero-authenticated">
      {/* {accessToken ? AuthenticatedTokenPage() : LoadingError()} */}
      {AuthenticatedTokenPage()}
    </div>
  );
}

export default HeroAuthenticated;