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
class Playlist extends Component{
  render() {
    return (
      <div>
        <img/>
        <h3>Playlist Name</h3>
        <ul><li>Song 1</li><li>Song 2</li><li>Song3</li></ul>
      </div>
    );
  }
}
class App extends Component{
  constructor() {
    super();
    this.state = {serverData: {}}
  }
  componentDidMount() {
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
          <SongCount songs={this.state.serverData.user &&
            this.state.serverData.user.songs}/>
          <HourCounter songs={this.state.serverData.user &&
            this.state.serverData.user.songs}/>
          <SearchBar>

          </SearchBar>
          <Playlist>

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