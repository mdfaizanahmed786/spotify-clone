import { atom } from "recoil";
// to get the entire playlist we need to make a request to the spotify api.
export const playlistState=atom({
    key: 'playlistState',
    default:null
})

// to store the id
export const playlistIdState = atom({
    key: "playlistIdState",
    default: "0MEyE0CQ2sfp3Afb1g96Vx",
});