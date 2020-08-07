const router = require('express').Router();
const passport = require('passport');

router.get('/spotify', passport.authenticate('spotify'));

app.get(
    '/auth/spotify/redirect',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

module.exports = router;