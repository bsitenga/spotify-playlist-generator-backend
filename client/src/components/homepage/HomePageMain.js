import React from 'react';
import '../../App.css';
import Hero from './Hero.js';
import FavoritePlaylists from './FavoritePlaylists.js';

function HomePageMain() {
  return (
    <div className="home-page-master-container">
      <Hero />
      <h2 className="favorite-playlists-header">Our Favorite Playlists</h2>
      <FavoritePlaylists />
    </div>
  );
}

export default HomePageMain;
