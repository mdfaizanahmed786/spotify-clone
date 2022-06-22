/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRecoilState } from "recoil";
import { currentTrackStateId, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

const Song = ({ track, order }) => {
    const duration = millisToMinutesAndSeconds(track.track.duration_ms);
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackStateId);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const spotifyApi=useSpotify();

    const playSong=()=>{
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);
        // you just can't say play, you need to pass the uri of the song.
        // now what is uri?
        // uri is the unique identifier of the song.
       spotifyApi.play({

        uris: [track.track.uri],
    

       })
    }
  return (
    <div>
      <div className="grid md:grid-cols-7 grid-cols-3 hover:bg-gray-900 px-4 py-3 transition-all duration-150 ease-in-out rounded-md cursor-pointer gap-14 md:gap-0 " onClick={playSong}>
        <div className="flex gap-5 items-center md:col-span-3 col-span-2">

        <p className="text-white text-sm">{order + 1}</p>
        <div className="flex gap-3">
          <img
            src={track.track.album.images[0].url}
            alt="song_pic"
            className="h-10 w-10"
          />
          <div className="flex flex-col gap-1">
            <p className="text-white text-sm font-bold w-36 lg:w-64 truncate">{track.track.name}</p>
            <p className="text-white text-xs">{track.track.artists[0].name}</p>
          </div>
        </div>
        </div>
        <p className="text-gray-500 text-sm hover:text-white cursor-pointer col-span-3 hidden md:inline mt-2">{track.track.album.name}</p>
        <p className="text-gray-500 text-sm hover:text-white cursor-pointer mt-2 ml-2">{duration}</p>
      </div>
    </div>
  );
};

export default Song;
