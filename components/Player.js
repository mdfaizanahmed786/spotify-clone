/* eslint-disable @next/next/no-img-element */
import { VolumeUpIcon } from "@heroicons/react/outline";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeOffIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackStateId, isPlayingState } from "../atoms/songAtom";
import useSonginfo from "../hooks/useSonginfo";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

const Player = () => {
  const spotifyApi = useSpotify();
  const songInfo = useSonginfo();
  const [volume, setVolume] = useState(50);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackStateId);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState(0);
  const [range, setRange] = useState(0);

  //   We are fetching the songinfo from the api and if the songinfo is not there then we fetch it from the api. which means we are fetching the songinfo on reoloading if there is no song info available.
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((res) => {
        setCurrentTrackId(res?.body?.item.id);
        spotifyApi.getMyCurrentPlaybackState().then((res) => {
          setIsPlaying(res?.body?.is_playing);
        });
      });
    }
  };

  // handling play and pause
  const handlePause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((res) => {
      if (res.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    spotifyApi.getMyCurrentPlayingTrack().then((res) => {
      setProgress(res?.body?.progress_ms);

      setRange(parseInt((progress / songInfo?.duration_ms) * 100));
    });
  }, [spotifyApi, progress, songInfo?.duration_ms]);

  const handleMute = () => {
    setVolume(0);
    spotifyApi.setVolume(0);
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackStateId, spotifyApi, session]);

  const debouncedSetVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((er) => {});
    }, 100),
    []
  );

  //   useeffect for adjusting volume
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedSetVolume(volume);
    }
  }, [volume]);

  const adjustRange = (e) => {};

  return (
    <div className="bg-black p-2  border-t border-gray-700 w-full   ">
      <div className="md:grid grid-cols-3 flex  gap-4 md:px-10 items-center justify-between md:p-3  py-3  ">
        <div className="songName  flex md:gap-4 md:items-start  ml-2 gap-2 md:ml-0">
          <img
            src={songInfo?.album.images?.[0]?.url}
            alt=""
            className="h-10 w-10 shadow-xl "
          />
          <div className="flex flex-col gap-1 items-center justify-center ">
            <p className="text-white text-sm font-bold text-left truncate">
              {songInfo?.name}
            </p>
            <p className="text-white text-xs">{songInfo?.artists?.[0].name}</p>
          </div>
        </div>
        <div className="player flex  md:flex-col ml-5 mf:ml-0 gap-3 md:pl-16 justify-center md:items-center">
          <div className="icon-group flex md:gap-10 gap-5 items-center md:mr-10">
            <SwitchHorizontalIcon className="text-white text-sm h-6 w-6 hover:text-gray-400 transition-all cursor-pointer  hidden md:block" />
            <RewindIcon className="h-6 w-6 text-white hover:text-gray-400 transition-all cursor-pointer hidden md:block " />
            {isPlaying ? (
              <PauseIcon
                onClick={handlePause}
                className="h-10 w-10 text-white hover:text-gray-400 transition-all hover:scale-110 cursor-pointer"
              />
            ) : (
              <PlayIcon
                onClick={handlePause}
                className="h-10 w-10 text-white hover:text-gray-400 transition-all trasform hover:scale-110 cursor-pointer "
              />
            )}
            <FastForwardIcon className="h-6 w-6 text-white hover:text-gray-400 transition-all cursor-pointer hidden md:block" />
            <ReplyIcon className="h-6 w-6 text-white hover:text-gray-400 transition-all cursor-pointer hidden md:block " />
          </div>
          <div className="controller flex gap-2 justify-center items-center mr-9">
            <p className="text-gray-600 text-sm  ">
              {millisToMinutesAndSeconds(progress)}
            </p>
            <input
              type="range"
              min={0}
              max={100}
              className="md:w-96 w-48 cursor-pointer hidden md:block "
              value={range}
              onChange={(e) => setRange(e.target.value)}
            />
            <p className="text-gray-600 text-sm hidden md:inline">
              {millisToMinutesAndSeconds(songInfo?.duration_ms)}
            </p>
          </div>
        </div>
        <div className="volume-controller hidden md:flex gap-2 justify-end">
          <VolumeOffIcon
            className="h-6 w-6 text-white hover:text-gray-400 transition-all cursor-pointer "
            onClick={handleMute}
          />
          <input
            type="range"
            min={0}
            max={100}
            className="cursor-pointer w-14 md:w-28"
            onChange={(e) => setVolume(Number(e.target.value))}
            value={volume}
          />
          <VolumeUpIcon
            className="h-6 w-6 text-white hover:text-gray-400 transition-all cursor-pointer "
            onClick={() => volume < 100 && setVolume(volume + 10)}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;

// so to control the volume we are using debouncing.
// we are using the useEffect hook to control the volume.
// what is the debouncing?
// debouncing is a technique that handles the situation where you want to perform an action after a certain amount of time has passed.
// You will not make the api request every time the value of the slider changes, instead you will wait for a certain amount of time to pass and then you will make the api request.
