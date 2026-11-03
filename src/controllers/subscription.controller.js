import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId = req.user._id
    const validChannelId = isValidObjectId(channelId)
    if (!validChannelId) {
        throw new ApiError(400, "Invalid channelId")
    }
    const channel = await Subscription.findOne({ channel: channelId, subscriber: userId })
    if(channel) {
        await Subscription.deleteOne({ channel: channelId, subscriber: userId })
        return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully"))
    }
    const newSubscription = await Subscription.create({ channel: channelId, subscriber: userId })
    return res.status(200).json(new ApiResponse(200, newSubscription, "Subscribed successfully"))

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const {page = 1, limit = 10} = req.query
    const validChannelId = isValidObjectId(channelId)
    if (!validChannelId) {
        throw new ApiError(400, "Invalid channelId")
    }
    const subscriberAggregation = [
        {
            $match: { channel: new mongoose.Types.ObjectId(channelId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribers",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            fullName: 1
                        }
                    }
                ]
            }
        }
    ]
    const subscribers = await Subscription.aggregatePaginate(subscriberAggregation, {
        page: Number(page),
        limit: Number(limit)
    })
    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const {page = 1, limit = 10} = req.query
    const validSubscriberId = isValidObjectId(subscriberId)
    if (!validSubscriberId) {
        throw new ApiError(400, "Invalid subscriberId")
    }
    const channelAggregation = [
        {
            $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channels",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            fullName: 1
                        }
                    }
                ]
            }
        }
    ]
    const channels = await Subscription.aggregatePaginate(channelAggregation, {
        page: Number(page),
        limit: Number(limit)
    })
    return res.status(200).json(new ApiResponse(200, channels, "Channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}