import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import HomePageMain from './components/homepage/HomePageMain.js';
import Navigation from './components/navbar/Navigation.js';
import About from './components/about/About.js';
import Developers from './components/developers/Developers.js';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	return (
		<Router>
			<div className="master-container">
				<Navigation />
			</div>

      <Switch>
        <Route path="/FAQ">
          <FAQ />
        </Route>
        <Route path='/about'>
          <About />
        </Route>
        <Route path='/developers'>
          <Developers />
        </Route>
        <Route path="/">
          <HomePageMain />
        </Route>
      </Switch>
		</Router>
	);
}

export default App;
