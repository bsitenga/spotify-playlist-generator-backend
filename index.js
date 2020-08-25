const express = require('express');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();

let jsonParser = bodyParser.json();

app.use(cors({origin: true, credentials: true}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// all API endpoints below

//Searches for song
app.post('/search', jsonParser, (req, res) => {
  let searchObject = req.body.searchObject;
  let itemArray = searchObject.tracks.items
  let trackIDs = []; 
  let artists = [];
  let popularity = [];
  let name = [];
  let images = [];

  // iterates through the search object and pushes href, artists, popularity, and name to its respective array
  for(let i=0;i<itemArray.length;i++){
    trackIDs.push(itemArray[i].href)
    artists.push(itemArray[i].artists[0].name)
    popularity.push(itemArray[i].popularity)
    name.push(itemArray[i].name)
    images.push(itemArray[i].album.images[0].url)
  }
  const data = {
    trackIDs: trackIDs,
    artists: artists,
    popularity: popularity,
    name: name,
    images: images
  }
  res.send(data);
});

// TODO: find average features from all given tracks within audio_features array
app.post('/trackdata', jsonParser, (req, res) => {
  let featureArray = req.body.trackObjects.audio_features;
  let averageDanceability;
  let averageEnergy;
  let averageInstrumentalness;
  let averageAcousticness;
  let averageLiveness;
  let averageValence;


})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});



const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Playlist generator listening on ${port}`);
