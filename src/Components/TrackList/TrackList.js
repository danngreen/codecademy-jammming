import React, { Component } from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends Component {
 	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.tracks){
			return (
				<div className="TrackList">
					{
						this.props.tracks.map( track => {
							return (
								<Track 
									key={track.id} 
									track={track} 
									listType={this.props.listType} 
									onTrackAction={this.props.onTrackAction}
								/>
							);
						})
					}
			 	</div>
			);
		} else {
			console.log(this);
		}
	}
}

export default TrackList;
