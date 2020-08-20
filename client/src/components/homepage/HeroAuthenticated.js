import React, { useEffect } from 'react';
import '../../App.css';

function HeroAuthenticated() {
  useEffect(() => {
    let code = getParams(window.location.href).code;
    if (code) {

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

  return (
    <div className="hero-authenticated">
      <h3>Choose Up to Five Songs</h3>
      <button onClick={() => console.log(this.props.match.params.id)}>test</button>
    </div>
  );
}

export default HeroAuthenticated;