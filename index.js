const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// all API endpoints below

//Searches for song
app.get('/search', (req, res) => {
	axios
		.get('https://jsonplaceholder.typicode.com/todos/1')
		.then(function(response) {
			// handle success
			console.log(response);
		})
		.catch(function(error) {
			// handle error
			console.log(error);
		})
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Playlist generator listening on ${port}`);
