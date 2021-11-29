// import package
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const rebirthSlotSchema = new Schema({
    userID: {
        type: ObjectId,
    },
    rebirthSlot: {
        type: Number,
    },
    rebirthCount: {
        type: Number,
    },
    childId: {
        type: ObjectId,
    },
    matrix : {
        type: Number,
    },
    level  : {
        type:Number,
    },
    date  : {
        type:Date,
        default:Date.now
    },

})

const rebirthSlot = mongoose.model("rebirthSlot", rebirthSlotSchema);

export default rebirthSlot;