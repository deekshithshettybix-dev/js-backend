import mongoose,{Schema} from "mongoose"
// import mongooseAggregatepaginate from "mongoose-aggregate-paginate-v2"

const playListSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        videos:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {timestamps:true}
)

// playListSchema.plugin(mongooseAggregatepaginate)
export const Playlist = mongoose.model("Playlist",playListSchema)