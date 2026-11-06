import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user._id
    const totalVideos = await Video.countDocuments({owner: channelId})
    const totalSubscribers = await Subscription.countDocuments({channel: channelId})
    const totalLikes = await Like.countDocuments({video: {$in: await Video.find({owner: channelId}).distinct("_id")}})
    const totalView = await Video.aggregate([
        {
            $match: {owner: new mongoose.Types.ObjectId(channelId)}
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        },
        {
            $project: {
                _id: 0,
                totalViews: 1
            }
        }
    ])
    const totalViews = totalView.length > 0 ? totalView[0].totalViews : 0
    console.log("Total channelId:", channelId)
    return res.status(200).json(new ApiResponse(200, {totalVideos, totalSubscribers, totalLikes, totalViews, channelId}, "Channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.user._id
    const {page = 1, limit = 10} = req.query
    const aggrigation = ([
        {
            $match: {owner: new mongoose.Types.ObjectId(channelId)}
        }
    ])
    const videos = await Video.aggregatePaginate(aggrigation, 
        {
            page:Number(page),
            limit:Number(limit)
        }
    )
    return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }