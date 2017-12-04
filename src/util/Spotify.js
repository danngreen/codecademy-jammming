let accessToken = "";
let expiresIn = 0;
const client_id = "8c34b5dec6b4435390197ce8441abc9c";
//const redirectURI = "http://localhost:3000/"; 
const redirectURI = "https://different-taste.surge.sh/"; 

const Spotify = {

	cachedTerms: "",

	getAccessToken(termsToCache) {

		this.cachedTerms = "";

		// Check if we already have an accessToken
		if (accessToken) {
			//console.log(`Have access token already ${accessToken}`);
			return accessToken;
		}

		//console.log(`Do not have access token already!`);

		// Check if we find the access token in the URL
		const loc 				= window.location.href;
		const accessTokenMatch 	= loc.match(/access_token=([^&]*)/);
		const expiresInMatch 	= loc.match(/expires_in=([^&]*)/);

		if (accessTokenMatch && expiresInMatch) {
			//console.log('Access token found in URL');
			accessToken = accessTokenMatch[1];
			expiresIn = expiresInMatch[1];

			window.setTimeout( () => accessToken = '', expiresIn * 1000 );
			window.history.pushState('Access Token', null, '/');

			return accessToken;
		}

		// Request the access token using the Spotify API
		//console.log('Initiating a request for an access_token');

		//Todo: this might be better to use for state (state=${randomNum})
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

		const requestHeaders = {
			headers: {Authorization: `Bearer ${accessToken}`}
		};

		const searchURL = 'https://api.spotify.com/v1/search'
			+ '?q=' + terms
			+ '&type=track';
		return fetch( searchURL, requestHeaders
		).then( 
			response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('Search API response.ok not truthy');
			}
		).then(
			jsonResponse => {
				if (jsonResponse.tracks.items){
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
					return searchResults;
				}
				//console.log("No json response");
				return[];
			}
		).catch(errorTerms => { console.log(errorTerms); } );
	},

	savePlaylist(trackURIs, playlistTitle) {
		//console.log(`saving play list, title=${playlistTitle}`);
		//console.log(trackURIs);
		if (!trackURIs.length || !playlistTitle) return;

		this.getAccessToken();

		// Request the user's ID (user name)
		const authHeader = {
			headers: {Authorization: `Bearer ${accessToken}`}
		};

		const userIDRequestURL = 'https://api.spotify.com/v1/me';

		return fetch( userIDRequestURL, authHeader 
		).then( 
			response => {
				if (response.ok)	return response.json();
				else				throw new Error('User ID request API response.ok not truthy');
			}
		).then(
			jsonResponse => {
				//console.log(`user ID = ${jsonResponse.id}`);
				if (jsonResponse.id)	return jsonResponse.id;
				else					throw new Error('No jsonResponse.id (user ID)');
			}
		).then(
			// Take the user ID returned from the last fetch, and use it to create a new playlist
			userID => {

				const postData = {
					method: 'POST',
					headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
					body: JSON.stringify({name: playlistTitle, description: 'Created with Jammming'}) 
				};

				const newPlaylistRequestURL = `https://api.spotify.com/v1/users/${userID}/playlists`;

				return fetch( newPlaylistRequestURL, postData
				).then( 
					response => {
						if (response.ok)	return response.json();
						else				throw new Error('Create new playlist request API response.ok not truthy');
					}
				).then(
					jsonResponse => {
						//console.log(`playlist ID = ${jsonResponse.id}`);
						if (jsonResponse.id)	return jsonResponse.id;
						else					throw new Error('No jsonResponse.id (playlist ID)');
					}
				).then(
					// Take the playlist ID from the last fetch and add tracks to it
					playlistID => {
						const trackPostData = {
							method: 'POST',
							headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
							body: JSON.stringify({uris: trackURIs})
						};
						//console.log(trackPostData);

						const addTracksRequestURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;

						return fetch( addTracksRequestURL, trackPostData
						).then( 
							response => {
								if (response.ok)	return response.json();
								else				throw new Error('Create new playlist request API response.ok not truthy');
							}
						).then(
							jsonResponse => {
								if (jsonResponse.snapshot_id)	return jsonResponse.snapshot_id;
								else					throw new Error('No jsonResponse.id (playlist ID)');
							}
						).then(
							snapshot_id => {
								//console.log(`New playlist snapshot_id=${snapshot_id}`);
								return snapshot_id;
							}

						).catch(errorTerms => { console.log(errorTerms.message); } );

					}
				).catch(errorTerms => { console.log(errorTerms.message); } );

			}
		).catch(errorTerms => { console.log(errorTerms.message); } );

	}


};

export { Spotify };