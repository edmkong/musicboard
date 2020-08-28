import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import VotingContainer from './Components/VotingContainer/VotingContainer'

var parsed = queryString.parse(window.location.search)
var accessToken = parsed.access_token;
var refreshToken = parsed.refresh_token;

// var fakeServerData = {
//   user:{
//     name: 'Edmond',
//     songs: [
//       {
//         name: 'Song 1!',
//         artist: 'Artist1',
//         duration: 360
//       },
//       {
//         name: 'Song 2',
//         artist: 'Artist2',
//         duration: 240
//       },
//       {
//         name: 'Song 3',
//         artist: 'Artist3',
//         duration: 200
//       }
//     ]
//   }
// };
class SearchBar extends  React.Component {
	constructor(props) {
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) { 
    this.props.onInputChange(event.target.value);
  }

   render() {
		return (
			<div className="container">
				<h2 className="heading">Search for a song</h2>
				<form>
					<input
						type="text"
            placeholder="Search by song name..."
            searchTerm = {this.props.searchTerm}
						onChange = {this.handleInputChange}
					/>
					<button> GO </button>
				</form>
			</div>
			);
	  }
}

class SongCount extends Component{
  render() {
    return (
      <div style={{width: "30%", display: 'inline-block' }}>
        <h2>{this.props.songs.length}Text</h2>
      </div>
    );
  }
}
class HourCounter extends Component{
  render() {
    var totalDuration = this.props.songs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div style={{width: "30%", display: 'inline-block' }}>
        <h2>Runtime:{Math.ceil(totalDuration/60)} minutes</h2>
      </div>
    );
  }
}

// playlist with all songs, display current song?
class Playlist extends Component{
  render() {
    return (
      <div>
        <img/>
        <h3>Playlist</h3>
        {/* <ul>
          {this.props.songs.map(song =>
            <li>{song.name + ": " + song.artist}</li>
          )}
        </ul> */}

      </div>
    );
  }
}
class App extends Component{
  constructor() {
    super();
    this.state = {
    serverData: {
      user:{
        name: '',
        playlist: {}
      }
    },
    searchTerm: '',
    searchResults: [],
    playlist: [],
    votingPanel: []
    };
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleUpvote = this.handleUpvote.bind(this)
  };

  fetchSearchResults(query) {
    const searchURL = 
    'https://api.spotify.com/v1/search?q=' + query + '&type=track';
    
    fetch(searchURL, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
    // .then(data => console.log(data.tracks.items))
    .then(data => this.setState({
      searchResults: data.tracks.items.map( item => {
        return {
          name: item.name,
          artist: item.artists[0].name,
          id: item.id
        }
    })
    }))
    
  }

  handleInputChange(searchTerm) {
    if (!searchTerm) {
      this.setState({
        searchTerm: ''
      });
    } else {
      this.setState({
        searchTerm:searchTerm
      });
      this.fetchSearchResults(searchTerm);
    }
  };

  addSongToPanel(song) {
    this.setState({
      votingPanel: [...this.state.votingPanel, 
      {name: song.name, artist: song.artist, id:song.id, votes: 0}]});
  }

  handleUpvote(track) {
    track.votes ++
    //set state of Voting Panel, prioritizing highest voted songs
    var newList = this.state.votingPanel.slice()
    newList.sort((a, b) => (a.votes > b.votes) ? -1 : 1)
    this.setState({votingPanel: newList})
  }

  componentDidMount() {
    //returns a promise
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
    // .then(data => console.log(data))
    .then(data => this.setState({serverData: {user: {name: data.display_name}}}))
  }
  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
        <div>
          <Container>
            <Row>
              <h1>
                {this.state.serverData.user.name}'s Musicboard
              </h1>
              {/* <SongCount songs={this.state.serverData.user.songs}/>
              <HourCounter songs={this.state.serverData.user.songs}/> */}
            </Row>
            <Row>
              <Col>
                <VotingContainer
                  tracks = {this.state.votingPanel}
                  upvote = {this.handleUpvote}
                />
              </Col>
              <Col>
                <SearchBar
                  searchTerm = {this.state.searchTerm}
                  onInputChange = {this.handleInputChange}
                  />
                  {this.state.searchResults.map((song, index) => (
                    <li key={song.id}>
                    <button onClick={() => this.addSongToPanel(song)}>Add to Queue</button>Song:{song.name} Artist:{song.artist}
                     </li>
                  ))}
              </Col>
            </Row>
          </Container>

        </div> : <button onClick ={() => window.location =
                'http://localhost:8888/login'}>Sign in with Spotify
                </button>
        }
      </div>
    );
  }
}

export default App;