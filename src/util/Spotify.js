let accessToken = "";
let expiresIn = 0;
const client_id = "8c34b5dec6b4435390197ce8441abc9c";
// const client_secret = "acb5fa39af5b42418bd725405024d009";
const redirectURI = "http://localhost:3000/"; 

const Spotify = {

	cachedTerms: "",

	getAccessToken(termsToCache) {

		this.cachedTerms = "";

		// Check if we already have an accessToken
		if (accessToken) {
			console.log(`Have access token already ${accessToken}`);
			return accessToken;
		}

		console.log(`Do not have access token already!`);

		// Check if we find the access token in the URL
		const loc 				= window.location.href;
		const accessTokenMatch 	= loc.match(/access_token=([^&]*)/);
		const expiresInMatch 	= loc.match(/expires_in=([^&]*)/);

		console.log('loc='+loc);
		console.log(accessTokenMatch);
		console.log(expiresInMatch);

		if (accessTokenMatch && expiresInMatch) {
			console.log('Access token found in URL');
			accessToken = accessTokenMatch[1];
			expiresIn = expiresInMatch[1];

			console.log('at='+accessToken);
			console.log('exin='+expiresIn);

			window.setTimeout( () => accessToken = '', expiresIn * 1000 );
			window.history.pushState('Access Token', null, '/');

			return accessToken;
		}

		// Request the access token using the Spotify API
		console.log('Initiating a request for an access_token');

		//const randomNum= Math.floor(Math.random() * 10000);

		const accessURL = 'https://accounts.spotify.com/authorize'
			+ '?response_type=token'
			+ '&client_id=' + client_id 
			+ '&redirect_uri=' + redirectURI
			+ '&scope=playlist-modify-public'
			+ '&state=' + termsToCache
			+ '&show_dialog=false';

		window.location.assign(accessURL);
	},


	search(terms) {
		this.getAccessToken(terms);

		const fakeResults = [
			{song: terms+'A', artist: "musicianA", album: "B-sidesA", id: "A", uri:""},
			{song: terms+'B', artist: "musicianB", album: "B-sidesB", id: "B", uri:""},
			{song: terms+'C', artist: "musicianC", album: "B-sidesC", id: "C", uri:""},
			{song: terms+'D', artist: "musicianD", album: "B-sidesD", id: "D", uri:""},
			{song: terms+'E', artist: "musicianE", album: "B-sidesE", id: "E", uri:""}
		];
		console.log(fakeResults);
		//return fakeResults;

		const requestInit = {
			headers: {Authorization: 'Bearer '+accessToken},
		};
		const searchURL = 'https://api.spotify.com/v1/search'
			+ '?q=' + terms
			+ '&type=track';
		return fetch( searchURL, requestInit
		).then( response => response.json()
			// response => {
			// 	if (response.ok) {
			// 		return response.json();
			// 	}
			// 	//throw new Error('Search API response not ok');
			// }
		).then(
			jsonResponse => {

				if (jsonResponse.tracks.items){
					console.log("got json");
					const searchResults = jsonResponse.tracks.items.map(
						track => {
							return({
								id: track.id,
								song: track.name,
								artist: track.artists[0].name,
								album: track.album.name,
								uri: track.uri
							});
						}
					);
					console.log(searchResults);
					return searchResults;
				}
				console.log("No json response");
				return[];
			}
		);
	},

	saveplaylist(trackURIs, playlistTitle) {

	}


};

export { Spotify };