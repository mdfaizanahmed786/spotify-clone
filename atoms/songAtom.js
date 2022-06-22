import { atom } from "recoil";

// selection of particular track id.
export const currentTrackStateId=atom({
    key: 'currentTrackStateId',
    default:null
})

// if the song is currently playing or not
export const isPlayingState=atom({
    key: 'isPlayingState',
    default:false
})