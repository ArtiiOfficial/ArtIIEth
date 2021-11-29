// import package
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
var filledSchema = new Schema({
    "rebirthcount"         : Number,
    "rebirthSlot"  	   : Number,
    "parentAdd"  	   :  ObjectId,
    "id"     : ObjectId,
    "matrix" : Number,
    "level"           : {type:Number,index: true},
    created_at           : {type:Date,default:Date.now},
  });

const userDetailsSchema = new Schema({
    userDet         : [filledSchema],
    userID: {
        type: String,
        default: "1"
    }
})

const userDetails = mongoose.model("userDetails", userDetailsSchema);

export default userDetails;