import { ClockIcon } from "@heroicons/react/outline";
import React from "react";
import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

const Songs = () => {
  const playlist = useRecoilValue(playlistState);
  console.log(playlist);

  return (
    <div className="md:px-9 px-3">
      <div className="md:grid grid-cols-7 pl-5 py-2 border-b border-gray-800 hidden">
        <p className="text-gray-400 col-span-3 hover:text-white text-sm cursor-pointer transition-all">
          # Title
        </p>
        <p className="text-gray-400 col-span-3 hover:text-white text-sm cursor-pointer  transition-all">
          Album
        </p>
        <ClockIcon className="h-6 w-6  text-gray-400 hover:text-white cursor-pointer transition-all" />
      </div>
      <div className="flex flex-col gap-1 md:mt-4">
        {playlist?.tracks.items.map((track, i) => (
          <Song key={track.track.id} track={track} order={i} />
        ))}
      </div>
    </div>
  );
};

export default Songs;


