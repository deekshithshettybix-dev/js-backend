import mongoose,{Schema} from "mongoose"
import mongooseAggregatepaginate from "mongoose-aggregate-paginate-v2"

const tweetSchema = new Schema(
    {
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        content:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)

tweetSchema.plugin(mongooseAggregatepaginate)
export const Tweet = mongoose.model("Tweet",tweetSchema)