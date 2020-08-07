const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const keys = require('./keys.js')

passport.use(
    new SpotifyStrategy(
      {
        clientID: 'keys.spotify.clientID',
        clientSecret: 'keys.spotify.clientSecret',
        callbackURL: '/auth/spotify/redirect'
      },
      function(accessToken, refreshToken, expires_in, profile, done) {
        console.log('profile')
      }
    )
  );