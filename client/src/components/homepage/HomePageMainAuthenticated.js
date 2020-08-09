import React from 'react';
import '../../App.css';
import Hero from './Hero.js';
import HeroRight from './HeroRight.js';
import FavoritePlaylists from './FavoritePlaylists.js';

function HomePageMainAuthenticated() {
  return (
    <div className="home-page-authenticated-master-container">
      <HeroRight />
      <h2 className="favorite-playlists-header">Our Favorite Playlists</h2>
      <FavoritePlaylists />
    </div>
  );
}

export default HomePageMainAuthenticated;
