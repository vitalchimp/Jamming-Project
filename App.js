import React from 'react';
import './App.css';
import SearchBar from '../src/components/SearchBar/SearchBar';
import SearchResults from '../src/components/SearchResults/SearchResults';
import Playlist from '../src/components/Playlist/Playlist';
import Spotify from '../src/util/Spotify';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{
        name:"",
        artist:"",
        album:"",
        id:""
      }],
      playlistName:"",
      playlistTracks:[{
        name:"",
        artist:"",
        album:"",
        id:""
      }]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(term) {
    return Spotify.search(term)
    .then( searchResults =>{
      this.setState({searchResults: searchResults});
    });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })

  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== tracks.id);
    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }



  render() {
    return (
      <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar onSearch={this.search}/>
    <div className="App-playlist">
      <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
      <Playlist onSave={this.savePlaylist} playlistname={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}/>
    </div>
  </div>
</div>

    );
  }
}
export default App;
