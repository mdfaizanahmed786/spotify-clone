/* eslint-disable @next/next/no-img-element */
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { MusicNoteIcon } from "@heroicons/react/outline";

const Center = () => {
  const { data: session } = useSession();
  const colors = [
    "from-indigo-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-blue-500",
    "from-aqua-500",
    "from-purple-500",
    "from-pink-500",
  ];
  // instead of using [playlistId, setPlaylistId] we can use useRecoilvalue, which means we can access the state of value of that id and it is impossible to mutate the state.
  // const playlistId = useRecoilValue(playlistIdState);
  const spotifyApi = useSpotify();
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [color, setColor] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  // using recoil state to manage the state of the current playlist.
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    setColor(shuffle(colors)[0]);
  }, [playlistId]);

  // fetching the playlist and if the playlist is not there then we fetch it from the api. and if the id changes.
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data.body);
        })
        .catch((er) => alert.log(er));
    }
  }, [spotifyApi, playlistId]);

  useEffect(() => {
    // if we do have the accesstoken then get the playlists
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);
  console.log(playlists);

  return (
    <div className="flex-1 relative overflow-y-scroll h-screen ">
      <header className="absolute top-3 right-8 left-0 py-2 px-3">
        <div className="flex justify-around md:justify-between gap-7  md:gap-0 items-center">
          <div className="controls flex  gap-4">
            <ChevronLeftIcon className="w-9 h-9 tex-white bg-black rounded-full text-white cursor-pointer hover:text-gray-300" />
            <ChevronRightIcon className="w-9 h-9 tex-white bg-black rounded-full text-white cursor-pointer hover:text-gray-300" />
          </div>
          <div className="flex gap-3 items-center">
            <p className="text-white text-sm font-bold hidden md:block  rounded-full border border-gray-400 py-2 px-6 cursor-pointer hover:text-gray-300">
              Upgrade
            </p>

            <div
              className="bg-black rounded-full flex   gap-2 py-1 px-2 items-center"
              onClick={() => signOut()}
            >
              <img
                src={session?.user?.image}
                alt="user_profile"
                className="h-7 w-7 rounded-full cursor-pointer"
              />
              <p className="text-white font-bold text-sm hover:text-gray-400 cursor-pointer">
                {session?.user?.name}
              </p>
              <ChevronDownIcon className="h-6 w-6 text-white hover:text-gray-400 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>
      <section
        className={`bg-gradient-to-b to-black ${color} flex items-end text-white  h-80 p-5`}
      >
        <div className="flex gap-5 items-center">
          <img
            src={playlist?.images?.[0]?.url}
            alt=""
            className="md:h-44 md:w-44 h-36 w-36 shadow-2xl"
          />
          <div className="playlist_info flex flex-col md:gap-4 gap-3">
            <p className="text-white text-sm capitalize font-bold">
              public playlist
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold capitalize">
              {playlist?.name}
            </h1>
            <div className="flex gap-2 items-center ">
              <img
                src={session?.user?.image}
                alt="user_profile"
                className="h-7 w-7 rounded-full cursor-pointer hidden md:block"
              />
              <p className="text-white text-sm hidden md:block">
                {playlist?.owner?.display_name}
              </p>
              <p className="text-white text-lg font-bold mb-2 hidden md:block">
                .
              </p>
              <p className="text-white text-sm font-bold">
                {playlist?.tracks.items.length} songs
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="md:pb-28 pb-32 flex flex-col gap-10 mt-6 md:mt-0  md:block">
        <Songs />
        <div className="md:hidden px-5">
          <div className="flex gap-2 items-center">
            <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl text-left  text-white hover:text-gray-500 font-extrabold capitalize">
              Your Playlists
            </h1>
            <p>
              <MusicNoteIcon className="text-white text-sm h-5 w-5" />
            </p>
          </div>
          <div
            className="flex text-sm gap-5 text-white
         p-2 mt-2 flex-col items-start justify-center md:hidden"
          >
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => setPlaylistId(playlist.id)}
                className="flex gap-2 items-center"
              >
                <img
                  src={playlist?.images?.[0]?.url}
                  alt=""
                  className="h-10 w-10 shadow-2xl"
                />
                <p className=" cursor-pointer  hover:text-gray-300 ">{playlist.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Center;

// what is loadash?
// loadash is a library that helps you to shuffle an array and get a random element from it.
