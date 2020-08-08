const express = require('express');
const path = require('path');
const cors = require('cors')
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const app = express();

app.use(cors({origin: true, credentials: true}));

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: 'http://whispering-sierra-43738.herokuapp.com/auth/spotify/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      console.log('profile:', profile)
    }
  )
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// all API endpoints below

app.get('/auth/spotify', passport.authenticate('spotify'), function(req, res) {
  
});

app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    function(req, res) {
      console.log('successful authentication');
      // Successful authentication, redirect home.
      res.redirect('/about');
    }
  );

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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Playlist generator listening on ${port}`);
