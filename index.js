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
// Link to example object: https://developer.spotify.com/console/get-audio-features-several-tracks/?ids=4JpKVNYnVcJ8tuMKjAj50A,2NRANZE9UCmPAS5XVbXL40,24JygzOLM0EmRQeGtFcIcG
app.post('/trackdata', jsonParser, (req, res) => {
  let trackObject = req.body.trackObject;
  let featureArray = trackObject.audio_features;
  let numTracks = featureArray.length;
  let averageDanceability = 0;
  let averageEnergy = 0;
  let averageInstrumentalness = 0;
  let averageAcousticness = 0;
  let averageLiveness = 0;
  let averageValence = 0;

  //for loop to gather attributes from each trackObject
  for (let i = 0; i < numTracks; i++) {
    averageDanceability += featureArray[i].danceability;
    averageEnergy += featureArray[i].energy;
    averageInstrumentalness += featureArray[i].instrumentalness;
    averageAcousticness += featureArray[i].acousticness;
    averageLiveness += featureArray[i].liveness;
    averageValence += featureArray[i].valence;
  }

  //fill in data
  const data = {
    averageDanceability: (averageDanceability / numTracks),
    averageEnergy: (averageEnergy / numTracks),
    averageInstrumentalness: (averageInstrumentalness / numTracks),
    averageAcousticness: (averageAcousticness / numTracks),
    averageLiveness: (averageLiveness / numTracks),
    averageValence: (averageValence / numTracks)
  }
  res.send(data);
})

//TODO: Find all trackURIs in the object
//Link to sample object: https://developer.spotify.com/console/get-recommendations/?limit=&market=US&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=&seed_tracks=0c6xIDDpzE81m2q797ordA&min_acousticness=&max_acousticness=&target_acousticness=&min_danceability=&max_danceability=&target_danceability=&min_duration_ms=&max_duration_ms=&target_duration_ms=&min_energy=0.4&max_energy=&target_energy=&min_instrumentalness=&max_instrumentalness=&target_instrumentalness=&min_key=&max_key=&target_key=&min_liveness=&max_liveness=&target_liveness=&min_loudness=&max_loudness=&target_loudness=&min_mode=&max_mode=&target_mode=&min_popularity=50&max_popularity=&target_popularity=&min_speechiness=&max_speechiness=&target_speechiness=&min_tempo=&max_tempo=&target_tempo=&min_time_signature=&max_time_signature=&target_time_signature=&min_valence=&max_valence=&target_valence=
app.post('/recommendations', jsonParser, (req, res) => {
  let recObject = req.body.recObject;
  let trackArray = recObject.tracks;
  let numTracks = trackArray.length;
  let trackURIs = [];

  //for loop
  for (let i = 0; i < numTracks; i++) {
    trackURIs[i] = trackArray[i].album.uri;
  }
  //send data
  res.send(trackURIs);
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});



const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Playlist generator listening on ${port}`);
