var request = require('request');

exports.searchArtists = function (token, query) {
	var apilink = "https://api.spotify.com/v1/search?type=artist&q=" + query;
	exports.invokeAPIReq(token, apilink);
};

exports.searchArtistSongs = function (token, artist) {
	var apilink = "https://api.spotify.com/v1/artists/" + artist + "/top-tracks"
};

exports.invokeAPIReq = function (token, apilink) {
	request.get({
		url: apilink,
		auth: {
			'bearer': token,
			'Accept': 'application/json'
		},
		json:true
	}, function (err, res) {
		console.log(res.body);
		return JSON.stringify(res.body);
	});
};