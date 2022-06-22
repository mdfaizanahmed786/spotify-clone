import SpotifyWebApi from "spotify-web-api-node";
// these are the scopes or the features that we want to access from the Spotify API.
const scopes = [
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
  "user-read-email",
  "user-read-recently-played",
  "user-top-read",
  "user-follow-read",
  "user-read-recently-played",
  "user-read-currently-playing",
  "user-modify-playback-state",
  "user-read-playback-state",
 
].join(',');

// we are using join method to concatenate the scopes with a comma. i.e user-read-email,user-read-private

const params={
    scope:scopes,
}
// use the SpotifyWebApi constructor to create a new instance of the SpotifyWebApi
// queryParmasString is a string of query parameters that will be added to the Spotify API endpoint
const queryParamsString=new URLSearchParams(params)

const LOGIN_URL=`https://accounts.spotify.com/authorize?${queryParamsString.toString()}`

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
 
});

export default spotifyApi;
export {LOGIN_URL};