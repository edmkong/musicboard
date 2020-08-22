import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

var fakeServerData = {
  user:{
    name: 'Edmond',
    songs: [
      {
        name: 'Song 1!',
        artist: 'Artist1',
        duration: 360
      },
      {
        name: 'Song 2',
        artist: 'Artist2',
        duration: 240
      },
      {
        name: 'Song 3',
        artist: 'Artist3',
        duration: 200
      }
    ]
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
class SearchBar extends Component{
  render() {
    return (
      <div>
        <img/>
        <input type='text'/> Search
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
        <ul>
          {this.props.songs.map(song =>
            <li>{song.name + ": " + song.artist}</li>
          )}
        </ul>

      </div>
    );
  }
}
class App extends Component{
  constructor() {
    super();
    this.state = {serverData: {},
    searchString: ''
    };
  }

  componentDidMount() {
    var parsed = queryString.parse(window.location.search)
    var accessToken = parsed.access_token;
    var refreshToken = parsed.refresh_token;
    //returns a promise
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
    .then(data => console.log(data))
    //.then(data => this.setState({serverData: {user: {name: data.display_name}}}))
  }
  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
        <div>
          <h1>
            {this.state.serverData.user.name}'s Musicboard
          </h1>
          <SongCount songs={this.state.serverData.user.songs}/>
          <HourCounter songs={this.state.serverData.user.songs}/>
          <SearchBar>

          </SearchBar>
          <Playlist songs={this.state.serverData.user.songs}>

          </Playlist>
        </div> : <button onClick ={() => window.location =
                'http://localhost:8888/login'}>Sign in with Spotify
                </button>
        }
      </div>
    );
  }
}

export default App;