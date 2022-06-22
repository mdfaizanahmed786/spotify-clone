import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  DotsHorizontalIcon,
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";

const Sidebar = () => {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const spotifyApi = useSpotify();

  useEffect(() => {
    // if we do have the accesstoken then get the playlists
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);
  // using recoil state to manage the state of the current playlist.
  const [playlistId, setPlaylistId]=useRecoilState(playlistIdState)
  
  return (
    <div className="overflow-y-scroll scrollbar-hide text-white py-6 px-10 text-xs md:text-sm  h-screen border-r border-gray-900 sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline">
      <div>
        <DotsHorizontalIcon className="w-6 cursor-pointer mb-9 hover:text-gray-500" />
      </div>
      <div className="space-y-5 mb-11">
        <div className="flex gap-2 hover:text-gray-300 items-center cursor-pointer">
          <HomeIcon className="w-6   text-white" />
          <p className="text-sm">Home</p>
        </div>
        <div className="flex gap-2 hover:text-gray-300 items-center cursor-pointer">
          <SearchIcon className="w-6   text-white" />
          <p className="text-sm">Search</p>
        </div>
        <div className="flex gap-2 hover:text-gray-300 items-center cursor-pointer">
          <LibraryIcon className="w-6   text-white" />
          <p className="text-sm">Your Library</p>
        </div>
      </div>

      <div className="space-y-5 mb-3">
        <div className="flex gap-3 hover:text-gray-300 items-center cursor-pointer">
          <PlusCircleIcon className="w-6   text-white" />
          <p className="text-sm">Create Playlist</p>
        </div>
        <div className="flex gap-3 hover:text-gray-300 items-center cursor-pointer">
          <HeartIcon className="w-6 text-purple-500" />
          <p className="text-sm ">Your Liked Songs</p>
        </div>
      </div>

      <div className="border-b border-gray-600 mt-5" />
      <div className="flex text-sm gap-5 p-2 mt-2 flex-col items-start">
        {playlists.map(({ id, name }) => (
          <p className=" cursor-pointer  hover:text-gray-300 " key={id} onClick={()=>setPlaylistId(id)}>
            {name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
