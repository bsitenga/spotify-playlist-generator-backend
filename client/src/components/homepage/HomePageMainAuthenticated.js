import React from 'react';
import '../../App.css';
import Hero from './Hero.js';
import FavoritePlaylists from './FavoritePlaylists.js';

function HomePageMainAuthenticated() {
  return (
    <div className="home-page-authenticated-master-container">
      <Hero />
      <h2>Our Favorite Playlists</h2>
      <FavoritePlaylists />
    </div>
  );
}

export default HomePageMainAuthenticated;
