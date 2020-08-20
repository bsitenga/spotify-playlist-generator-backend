import React from 'react';
import '../../App.css';
import HeroAuthenticated from './HeroAuthenticated.js';
import FavoritePlaylists from './FavoritePlaylists.js';

function HomePageMainAuthenticated() {
  return (
    <div className="home-page-authenticated-master-container">
      <HeroAuthenticated />
      <h2 className="favorite-playlists-header">Our Favorite Playlists</h2>
      <FavoritePlaylists />
    </div>
  );
}

export default HomePageMainAuthenticated;
