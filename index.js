const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();

app.use(cors({origin: true, credentials: true}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// all API endpoints below

//Searches for song
app.get('/search', (req, res) => {
  let searchObject = req.body.searchObject;
  let trackIDs = [];
  //TODO: go through the search object and push each track href to the trackIDs array
  // scope: user-library-modify
  const data = {
    trackIDs: trackIDs,
  }
  res.send(data);
});

// Authorizes user's Spotify account
app.get('authorize', (req, res) => {
  var scopes = 'playlist-modify-public'; // Allows for the app to modify the user's public playlists
  res.redirect('https://accounts.spotify.com/authorize' + 
  '?response_type=code' +
  '&client_id=' + my_client_id +
  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  '&redirect_uri' + encodeURIComponent(redirect_uri));
});


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});



const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Playlist generator listening on ${port}`);
