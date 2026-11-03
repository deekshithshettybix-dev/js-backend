import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description, videos} = req.body
    const owner = req.user._id
    const playlist = await Playlist.create({name, description, videos, owner})
    return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"))
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const playlists = await Playlist.find({owner: userId}).sort({createdAt: -1}).populate({
        path: "videos",
        select: "title description thumbnail"
    })
    return res.status(200).json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const playlist = await Playlist.findById(playlistId).populate({
        path: "owner",
        select: "email fullName avatar"
    })
    .populate({
        path: "videos",
        select: "title description thumbnail"
    })
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    playlist.videos.push(videoId)
    await playlist.save()
    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
    // TODO: add video to playlist
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId.toString())
    await playlist.save()
    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    await playlist.remove()
    return res.status(200).json(new ApiResponse(200, null, "Playlist deleted successfully"))
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    playlist.name = name
    playlist.description = description
    await playlist.save()
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"))
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}