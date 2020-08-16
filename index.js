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
  let itemArray = searchObject.tracks.item
  let trackIDs = [];
  let names = [];
  let artists = [];
  let popularity = [];
  //TODO: go through the search object and push each track href to the trackIDs array
  //      name, href, artist, popularity
  
  for (let i = 0; i < itemArray.length; i++) {
    trackIDs[i] = itemArray[i].href;
    names[i] = itemArray[i].name;
    artists[0] = itemArray[i].album.artists.name;
    popularity[0] = itemArray[i].popularity;
  }

  const data = {
    trackIDs: trackIDs,
    names: names,
    artists: artists,
    popularity: popularity
  }
  res.send(data);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});



const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Playlist generator listening on ${port}`);
