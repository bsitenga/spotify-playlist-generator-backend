import React, { useEffect, useState } from 'react';
import '../../App.css';
import axios from 'axios';
import qs from 'qs';
import ChooseMode from './ChooseMode.js';

function HeroAuthenticated() {
  const [accessToken, setAccessToken] = useState('');
  const [userMode, setUserMode] = useState(2);

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

  const AuthenticatedTokenPage = () => {
    if (userMode === 1) {

    } else if (userMode === 3) {

    }
    return <ChooseMode accessToken={accessToken}/>
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