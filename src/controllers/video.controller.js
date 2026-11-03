import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadToCloudinary} from "../utils/cloudinary.js"


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

    const aggrigation = ([
            ...(validUserId ? [ { $match:{ owner:new mongoose.Types.ObjectId(userId.trim()) } } ] : []),
            ...(validQuery ? [ { $match:{ 
                $or:[
                    {title:{$regex: validQuery, $options:"i"} },{description:{$regex:validQuery, $options:"i"}}
                ]
             } } ] : []),
             {
                $lookup:{
                    from: "users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner",
                    pipeline:[
                        {
                            $project:{
                                fullName:1,
                                username:1,
                                avatar:1
                            }
                        }
                    ]
                }
             },
             {
                $sort:{
                    [sortBy]:sortOrder
                }
             }

    ])
    
    const videos = await Video.aggregatePaginate(aggrigation,
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
    const videoFile = req.files?.videoFile?.[0]
    const thumbnail = req.files?.thumbnail?.[0]

    if(
        [title, description].some((field)=>field?.trim() === "")
     ){
        throw new ApiError(400, "'title, description' all fields are required");
     }
     if(! videoFile || ! thumbnail){
        throw new ApiError(400, "'videoFile, thumbnail' all fields are required");
     }
     const videoFileLocalpath = videoFile.path
     const thumbnailLocalpath = thumbnail.path

     const videoFileUploaded = await uploadToCloudinary(videoFileLocalpath)
     const thumbnailUploaded = await uploadToCloudinary(thumbnailLocalpath)

     const video = await Video.create({
        videoFile : videoFileUploaded.url,
        thumbnail: thumbnailUploaded.url,
        title,
        description,
        duration: videoFileUploaded.duration,
        isPublished: true,
        views : 0,
        owner: req.user._id
     })

     return res.status(200).json(new ApiResponse(200,video,"videos published successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(videoId)
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200,video,"videos fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const thumbnailFile = req.file?.path

    if(!thumbnailFile){
        throw new ApiError(400,"video file is missing")
    }
    const {title, description} = req.body
    if(! title || ! description ){
        throw new ApiError(400,"title and description both are required")
    }
    const thumbnail = await uploadToCloudinary(thumbnailFile)
    //TODO: update video details like title, description, thumbnail
    const video = await Video.findByIdAndUpdate(videoId,
        {
            $set: {title, description, thumbnail:thumbnail.url}
        },
        {
            new : true
        }
    )
    return res.status(200).json(new ApiResponse(200,video,"video detail updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findByIdAndDelete(videoId)
    if(! video){
        throw new ApiError(400, "Video not found")
    }
    //TODO: delete video
    return res.status(200).json(new ApiResponse(200,video,"video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    video.isPublished = !video.isPublished
    await video.save()
    return res.status(200).json(new ApiResponse(200,video,"video publish status updated successfully"))
})

const updateView = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id
    const video = await Video.findById(videoId)
    video.views = video.views + 1
    await video.save()
    await User.findByIdAndUpdate(
        userId,
        {
            $addToSet: {
                watchHistory: videoId
            }
        }
    );
    return res.status(200).json(new ApiResponse(200,video,"video view updated successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    updateView
}