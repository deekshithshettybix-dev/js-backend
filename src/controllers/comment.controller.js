import mongoose from "mongoose"
import {Commnet} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/ApiError.js"
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const aggrigation = await Comment.aggregate([
        {
            $match:{
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $object:{
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
                createdAt: -1
            }
        },
        {
            $project:{
                _id:1,
                content:1,
                video:1,
                owner:1
            }
        }
    ])
    const videoComments = await Comment.aggregatePaginate(aggrigation,
        {
            page:Number(page),
            limit:Number(limit)
        }
    )
    return res.status(200).json(new ApiResponse(200,videoComments,"video comment fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body
    const user = req.user?._id;

    const video = await Video.findById(videoId)
    if(! video){
        throw new ApiError(400,"video not found")
    }

    const comment = await Commnet.create({
        content:content,
        video:video._id,
        owner:user._id
    })

    return res.status(200).json(new ApiResponse(200,comment,"Video comment added sucessfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    if(! content || content.trim() === ""){
        throw new ApiError(400,"content field is required")
    }

    const comment = await Comment.findByIdAndUpdate(commentId,
        {
            $set:{
                content:content
            }
        },
        {
            new:true
        }
    )
    // const comment = Comment.findById(commentId)
    // if(! comment){
    //     throw new ApiError(400,"comment not found")
    // }
    // comment.content = content
    // comment.save()
    return res.status(200).json(new ApiResponse(200,comment,"Video comment updated sucessfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const comment = await Comment.findByIdAndDelete(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    return res.status(200).json(new ApiResponse(200,comment,"Video comment deleted sucessfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }