let accessToken = "";

const clientID= "202c3235fc6a42b1939ad545088c048a";
const redirect_uri = 'http://localhost:3000/';


const Spotify = {

    savePlaylist(playlistName, trackURIs){
        if(!playlistName || !trackURIs){
            return;
        }
        let accessToken = Spotify.getAccessToken();
        let headers = {Authorization: `Bearer ${accessToken}`};
        let userID;
        return fetch(`https://api.spotify.com/v1/me`,{headers: headers})
        .then(response => response.json()
        ).then(jsonResponse =>{
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/{user_id}/playlists/${playlistID}/tracks`,{
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                })
            })
        })

    },


    search(term){
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
            {
                headers: {Authorization: `Bearer ${accessToken}`}
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if( !jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    getAccessToken(){
        if(accessToken){
            return accessToken;
        }
        let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            
            window.setTimeout(() => accessToken = '', expiresInMatch * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
        }

    }



}






export default Spotify;