import { signIn, useSession } from "next-auth/react";
import React from "react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import spotifyApi from "../lib/spotify";
const useSpotify = () => {
  const { data: session } = useSession();

  // const spotifyApi = new SpotifyWebApi({
  //   clientId: process.env.NEXT_PUBLIC_CLIENT_KEY,
  //   clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  // });
  useEffect(() => {
    // if the session does exists
    if (session) {
     
      // if the refreshaccesstoken attempt fails, then redirect the user to login page
      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }

      // else use the refreshaccesstoken to refresh the accesstoken
     
      spotifyApi.setAccessToken(session.accessToken);
    }
  }, [session]);

  return spotifyApi;
};

export default useSpotify;

// we are creating this hook to get the session from the next-auth and if the session does not exist then redirect the user to the login page. and if the session does exists use throughout the app.
