import mongoose, {Schema} from "mongoose"
import mongooseAggregatepaginate from 'mongoose-aggregate-paginate-v2';

const subscriptionSchema = new Schema(
    {
        subscriber: {
            type:Schema.Types.ObjectId, //One who is subscribing
            ref: "User"
        },
        channel: {
            type:Schema.Types.ObjectId, //One to whom channel owner
            ref: "User"
        }

    }, 
    {timestamps:true}
)
subscriptionSchema.plugin(mongooseAggregatepaginate);
export const Subscription = mongoose.model("Subscription",subscriptionSchema)