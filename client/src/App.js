import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import VotingContainer from './Components/VotingContainer/VotingContainer'

var parsed = queryString.parse(window.location.search)
var accessToken = parsed.access_token;
var refreshToken = parsed.refresh_token;


class SearchBar extends  React.Component {
	constructor(props) {
		super(props);
    this.handleInputChange = this.handleInputChange.bind(this)
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

class CurrentSong extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="currentsong">
        {this.props.song.name ? 
        <div>
        {this.props.song.name} <p></p>
        {this.props.song.artist}
        <img src={this.props.song.image.url} height={200} />
        </div> : "Please start web player and refresh"
        }
      </div>
      );
    }
  }

class App extends Component{
  constructor() {
    super();
    this.state = {
      userData: {
        name: '',
        id: '',
        musicBoard: {
          id: '',
          uri: ''
        }
      },
      currentSong: {
        name: '',
        image: '',
        artist: '',
        id: '',
        duration: 0
      },
      searchTerm: '',
      searchResults: [],
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
          id: item.id,
          uri: item.uri
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
    var uri = song.uri;
    fetch('https://api.spotify.com/v1/me/player/queue?uri=' + uri, {
    method: 'POST',
    headers: { 
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
    })
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
  //creates a new MusicBoard playlist and sets musicBoard id
  createPlaylist(user_id) {
    const body = JSON.stringify({name:'MusicBoard Playlist'})
    fetch('https://api.spotify.com/v1/users/' + user_id + '/playlists', {
    method: 'POST',
    body: JSON.stringify({
      name: 'MusicBoard Playlist',
      public: false,
      collaborative: true}),
    headers: { 
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
    })
    .then(response => response.json())    
    .then(data => this.setState({
      userData: {musicBoard: {id: data.id, uri: data.uri}}
    }))
  }
  //checks if a Musicboard Playlist is present
  findMusicBoard(playlists, target) {
    for (var i = 0, len = playlists.length; i < len; i++) {
      console.log(playlists[i])
      if (playlists[i].name === target) {
        this.setState({
          musicBoard: {...this.state.userData.musicBoard,
          id: playlists[i].id, uri: playlists[i].uri}
        })
        break
      }
    }
    return false
  }

  async getCurrentSong() {
    const response = await fetch('https://api.spotify.com/v1/me/player', {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + accessToken}
    })
    const json = await response.json()
    console.log(json.item)
    this.setState({
      currentSong: {
        name: json.item.name,
        image: json.item.album.images[0],
        artist: json.item.artists[0].name,
        id: json.item.id,
        duration: json.item.duration_ms
      }
      })
  }
  
  popVotingPanel() {
    var newPanel = this.state.votingPanel.slice()
    if (this.state.currentSong.id === newPanel[0].id) {
      this.setState({votingPanel: newPanel.shift()})
    }
  }
  player_play(action) {
    fetch('https://api.spotify.com/v1/me/player/'+ action, {
    method: 'PUT',  
    headers: {'Authorization': 'Bearer ' + accessToken }
    })
    this.getCurrentSong()
  }
  player_skip(action) {
    fetch('https://api.spotify.com/v1/me/player/'+ action, {
    method: 'POST',  
    headers: {'Authorization': 'Bearer ' + accessToken }
    })
    this.getCurrentSong()    
  }

  componentDidMount() {
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
    .then(data => this.setState({
      userData: 
        {name: data.display_name, id: data.id}
    }))
    fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: {'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())


    fetch('https://api.spotify.com/v1/me/player', {
      headers: {'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
    .then(json => this.setState({
        currentSong: {
          name: json.item.name,
          image: json.item.album.images[0],
          artist: json.item.artists[0].name,
          id: json.item.id,
          duration: json.item.duration_ms
        }
    }))
  }
  componentDidUpdate() {
    console.log("currentsong", this.state.currentSong)
  }
  render() {
    return (
      <div className="App">
        {this.state.userData ?
        <div>
          <Container>
            <Row>
              <h1>
                {this.state.userData.name}'s Musicboard
              </h1>
            </Row>
            <Row>
              <h1>Now Playing:</h1>
                <CurrentSong
                  song = {this.state.currentSong}
                /> 
            </Row>
            <Row>
              <button onClick={() => this.player_skip('previous')
              }>Previous</button>
              <button onClick={() => this.player_play('play')
              }>Play</button>
              <button onClick={() => this.player_play('pause')
              }>Pause</button>
              <button onClick={() => this.player_skip('next')
              }>Next</button>
            </Row>
            <Row>
              <Col>
                <VotingContainer
                  tracks = {this.state.votingPanel}
                  upvote = {this.handleUpvote}
                />
              </Col>
              <Col xs={6}>
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