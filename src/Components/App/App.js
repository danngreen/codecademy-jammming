import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';

const defaultPlaylistTitle = "New Playlist";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchResultTracks: [
			],
			playlistTracks: [
			],
			playlistTitle: defaultPlaylistTitle,
			loadingText: " "
		};

		this.searchSpotify 		= this.searchSpotify.bind(this);
		this.setPlaylistTitle	= this.setPlaylistTitle.bind(this);
		this.addTrack			= this.addTrack.bind(this);
		this.removeTrack		= this.removeTrack.bind(this);
		this.saveSpotifyPlaylist= this.saveSpotifyPlaylist.bind(this);
		this.handleLoad 		= this.handleLoad.bind(this);
	}

	componentDidMount() {
		window.addEventListener('load', this.handleLoad);
	}

	handleLoad() {
		//Check the URL to see if we cached the search terms in the "state" identifier in the URL
		//This is a cheap hack, and not secure since "state" should be used to correlate the request and response
		//But it resovles the issue where a user searches for terms, then is asked to log in, then has to type the terms and search again
		const stateMatch = window.location.href.match(/state=([^&]*)/);

		if (stateMatch) {
			if (stateMatch[1].length) {
				//console.log(`Cached search terms found: ${stateMatch[1]}`);
				this.searchSpotify(stateMatch[1]);
			}
		}
	}

	searchSpotify(terms) {
		if (terms) {
			this.setState({loadingText: "Searching..."});

			Spotify.search(terms)
			.then( searchResults => {
				this.setState({searchResultTracks: searchResults});
				this.setState({loadingText: " "});
			});
		} else {
			this.setState({searchResultTracks: []});
		}
	}

	saveSpotifyPlaylist() {
		if (this.state.playlistTitle && this.state.playlistTracks.length) {

			const newPlaylistTitle = this.state.playlistTitle;

			this.setState({loadingText: `Saving Playlist ${newPlaylistTitle}...`});

			let trackURIs = [];
			this.state.playlistTracks.forEach( track => {
				trackURIs.push( track.uri );
			});

			Spotify.savePlaylist(trackURIs, newPlaylistTitle)
			.then( snapshot_id => {
				//console.log(`Playlist saved! ${snapshot_id}`);

				this.setState({
					searchResultTracks: [],
					playlistTracks: [],
					playlistTitle: defaultPlaylistTitle
				});
				this.setState({loadingText: `Playlist ${newPlaylistTitle} saved!`});
				return;

			} ).catch(errorTerms => console.log(`Error: ${errorTerms.message}`) );

			this.setState({loadingText: `Playlist ${newPlaylistTitle} could not be saved :(`});

		} else {
			this.setState({loadingText: `Please add tracks and enter a title to save a playlist`});

		}
	}

	setPlaylistTitle(title) {
		this.setState({playlistTitle: title});
	}

	addTrack(track) {
		let isAlreadyInPlaylist = false;

		//Check if the track is already in the playlist
		this.state.playlistTracks.forEach( t => {
			if (t.id === track.id) isAlreadyInPlaylist = true;
		});

		//Append the track to the end of the playlist
		if (!isAlreadyInPlaylist) {
			let newPlayListTracks = this.state.playlistTracks;

			newPlayListTracks.push(track);
			this.setState({playlistTracks: newPlayListTracks});
		}
	}

	removeTrack(track) {
		const index = this.state.playlistTracks.indexOf(track);

		if (index !== -1) {
			let newPlayListTracks = this.state.playlistTracks;

			newPlayListTracks.splice(index, 1);
			this.setState({playlistTracks: newPlayListTracks});
		}

	}

	render() {
		return (
			<div>
				<h1>Ja<span className="highlight">mmm</span>ing</h1>

				<div className="App">
					<SearchBar doSearch={this.searchSpotify} />
					<div className="loading-text">{this.state.loadingText}</div>
					<div className="App-playlist">
						<SearchResults
							tracks={this.state.searchResultTracks}
							onTrackAction={this.addTrack}
						/>
						<Playlist
							tracks={this.state.playlistTracks}
							title={this.state.playlistTitle}
							onChangeTitle={this.setPlaylistTitle} 
							onTrackAction={this.removeTrack}
							onSave={this.saveSpotifyPlaylist}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
