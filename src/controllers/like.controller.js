import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id
    const validVideoId = isValidObjectId(videoId)
    if (!validVideoId) {
        throw new ApiError(400, "Invalid videoId")
    }
    const like = await Like.findOne({ video: videoId, user: userId })
    if (like) {
        await Like.deleteOne({ video: videoId, user: userId })
        return res.status(200).json(new ApiResponse(200, {}, "Video unliked successfully"))
    }
    //TODO: toggle like on video
    const newLike = await Like.create({ video: videoId, user: userId })
    return res.status(200).json(new ApiResponse(200, newLike, "Video liked successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user._id
    //TODO: toggle like on comment
    const validCommentId = isValidObjectId(commentId)
    if (!validCommentId) {
        throw new ApiError(400, "Invalid commentId")
    }
    const like = await Like.findOne({ comment: commentId, user: userId })
    if (like) {
        await Like.deleteOne({ comment: commentId, user: userId })
        return res.status(200).json(new ApiResponse(200, {}, "Comment unliked successfully"))
    }
    const newLike = await Like.create({ comment: commentId, user: userId })
    return res.status(200).json(new ApiResponse(200, newLike, "Comment liked successfully"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user._id
    //TODO: toggle like on tweet
    const validTweetId = isValidObjectId(tweetId)
    if (!validTweetId) {
        throw new ApiError(400, "Invalid tweetId")
    }
    const like = await Like.findOne({ tweet: tweetId, user: userId })
    if (like) {
        await Like.deleteOne({ tweet: tweetId, user: userId })
        return res.status(200).json(new ApiResponse(200, {}, "Tweet unliked successfully"))
    }
    const newLike = await Like.create({ tweet: tweetId, user: userId })
    return res.status(200).json(new ApiResponse(200, newLike, "Tweet liked successfully"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id
    const likedVideos = await Like.find({ user: userId, video: { $exists: true } }).populate({
        path: "video",
        select: "title description thumbnail"
    })
    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}