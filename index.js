const express = require('express');
const path = require('path');
const cors = require('cors')
const axios = require('axios');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(cors());

// all API endpoints below

//Searches for song
app.get('/search', (req, res) => {
  let searchObject = req.body.searchObject;
  let trackIDs = [];
  //TODO: go through the search object and push each track href to the trackIDs array

  const data = {
    trackIDs: trackIDs,
  }
  res.send(data);
});

app.get('/login', function(req, res) {
  var scopes = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + 'f0c3aa26b442470db2737973a26efc0a' +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent('http://whispering-sierra-43738.herokuapp.com/'));
  });

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Playlist generator listening on ${port}`);
