import mongoose, {Schema} from 'mongoose';
import mongooseAggregatepaginate from 'mongoose-aggregate-paginate-v2';

const commentSchema = new Schema(
    {
        content:{
            type:String,
            required:true
        },
        video:{
            type:Schema.Types.ObjectId,
            ref:"Video",
            required:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
    },
    {
        timestamps:true
    }
)

commentSchema.plugin(mongooseAggregatepaginate);
export const Comment = mongoose.model('Comment', commentSchema);