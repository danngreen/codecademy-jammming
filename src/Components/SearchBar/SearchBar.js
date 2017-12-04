import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			terms: ''
		};
		this.handleTermChange 		= this.handleTermChange.bind(this);
		this.handleSearch			= this.handleSearch.bind(this);
		this.handleKeyUp			= this.handleKeyUp.bind(this);
	}

	handleKeyUp(e){
		if(e.key !== "Enter") return;
		this.handleSearch(e);
	}

	handleTermChange(e){
		this.setState({terms: e.target.value});
	}

	handleSearch(e) {
		this.props.doSearch(this.state.terms);
		e.preventDefault();
	}


	render() {
		return (
			<div className="SearchBar">
				<input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyPress={this.handleKeyUp}/>
				<a onClick={this.handleSearch}>SEARCH</a>
			</div>
		);
	}
}

export default SearchBar;
