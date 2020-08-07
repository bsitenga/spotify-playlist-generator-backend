import React from 'react';
import './App.css';
import HomePageMain from './components/homepage/HomePageMain.js';
import Navigation from './components/navbar/Navigation.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="master-container">
      <Navigation />
      <HomePageMain />
    </div>
  );
}

export default App;
