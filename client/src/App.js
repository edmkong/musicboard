import React, { Component } from 'react';
import './App.css';

var fakeServerData = {
  user:{
    name: 'Edmond',
    songs: [
      {
        name: 'Song 1',
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
        <input type='text'/>
        Search
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

      </div>
    );
  }
}
class App extends Component{
  constructor() {
    super();
    this.state = {serverData: {}}
  }

  getParams (url) {
    var params = {};
    var paramString = url.split('#')[1]
    var queryParams = paramString.split('&')

    for (var i = 0; i < queryParams.length; i++) {
      var queryParam = queryParams[i]
      var keyPair = queryParam.split('=');
      var key = keyPair[0]
      var value = keyPair[1]
      params[key] = value
    }
    return params;
  };

  componentDidMount() {
    var queryString = window.location.href
    var queryParams = this.getParams(queryString);
    localStorage.clear()
    for (var key in queryParams) {
      localStorage.setItem(key, queryParams[key])
    }
    
    setTimeout(() => {
      this.setState({serverData: fakeServerData});
    }, 1000);
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
          <Playlist playlist={this.state.serverData.user}>

          </Playlist>
          <a href = 'http://localhost:8888'>
            <button>Login With Spotify</button>
          </a>
        </div> : <h1>Loading...</h1>
        }
      </div>
    );
  }
}

export default App;