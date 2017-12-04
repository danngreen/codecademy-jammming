import React, { Component } from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';
//import Track from '../Track/Track';

class Playlist extends Component {
 	constructor(props) {
		super(props);
		this.handleTitleChange 	= this.handleTitleChange.bind(this);
		this.handleSave 		= this.handleSave.bind(this);
	}

	handleTitleChange(e){
		this.props.onChangeTitle(e.target.value);
	}

	handleSave(e){
		this.props.onSave(); //Todo: why not pass the title here? we could make it a state of PLaylist instead of App
	}

	render() {
		return (
			<div className="Playlist">
				<input defaultValue={this.props.title} onChange={this.handleTitleChange}/>
				<TrackList
					tracks={this.props.tracks}
					listType="playlist"
					onTrackAction = {this.props.onTrackAction}
				/>

				<a className="Playlist-save" onClick={this.handleSave}>SAVE TO SPOTIFY</a>
			</div>
		);
	}
}

export default Playlist;
