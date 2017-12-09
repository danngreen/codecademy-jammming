import React, { Component } from 'react';
import './Track.css';

class Track extends Component {
	constructor(props) {
		super(props);
		this.handleAction = this.handleAction.bind(this);
		this.handleClick 	= this.handleClick.bind(this);
	}

	handleAction(e) {
		this.props.onTrackAction(this.props.track);
		e.preventDefault();
	}

	handleClick(e) {
		window.open(this.props.track.previewUrl, "PreviewWindow", "width=200, height=100");
		e.preventDefault();
	}
	render() {
		return (
			<div className="Track">
				<div className="Track-information">
					<h3><span className="preview">
						{this.props.track.previewUrl===null ? "" : (<a onClick={this.handleClick}><img src="http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-8/256/Play-icon.png" height="20" width="20" alt="[Preview]" /></a>)}
					</span>
					{this.props.track.song}</h3>					

					<p>{this.props.track.artist} | {this.props.track.album}</p>
				</div>
				<a className="Track-action" onClick={this.handleAction}>{this.props.listType === "searchResults" ? "+" : "-"}</a>
		 	</div>
		);
	}
}

export default Track;
