const router = require('express').Router();
const passport = require('passport');

router.get('/spotify', passport.authenticate('spotify'));

router.get(
    '/auth/spotify/redirect',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/about');
    }
  );

module.exports = router;