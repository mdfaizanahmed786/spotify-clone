import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackStateId } from "../atoms/songAtom";
import useSpotify from "./useSpotify";

const useSonginfo = () => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackStateId);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      // if the trackid is available, fetch the song info
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            // passing headers to the request
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        // set the song info
        setSongInfo(trackInfo);
      }
    };
    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
};
export default useSonginfo;

// when we fetch the data from the api, we pass the headers with the access token as a query parameter.
