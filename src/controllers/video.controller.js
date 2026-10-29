import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy="createdAt", sortType="desc", userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const validUserId =
    typeof userId === "string" &&
    userId.trim() !== "" &&
    mongoose.isValidObjectId(userId.trim());

    const validQuery = typeof query === "string" && query.trim() !== ""

    const sortOrder = (sortType=="asc")? 1 : -1

    const allowedSortFields = ["createdAt", "title", "duration", "views"];

    if (!allowedSortFields.includes(sortBy)) {
        throw new ApiError(400, "Invalid sortBy field");
    }

    const aggrigation = await Video.aggregate([
            ...(validUserId ? [ { $match:{ owner:new mongoose.Types.ObjectId(userId.trim()) } } ] : []),
            ...(validQuery ? [ { $match:{ 
                $or:[
                    {title:{$regex: validQuery, $options:"i"} },{description:{$regex:validQuery, $options:"i"}}
                ]
             } } ] : []),
             {
                $sort:{
                    [sortBy]:sortOrder
                }
             }

    ])
    const videos = await Comment.aggregatePaginate(aggrigation,
        {
            page:Number(page),
            limit:Number(limit)
        }
    )
    return res.status(200).json(new ApiResponse(200,videos,"videos fetched successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}