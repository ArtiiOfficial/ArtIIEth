// import package
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ActivitySectionSchema = new Schema({
        owner: {
            type: String,
            default: ""
        },
        activity: {
                type: String,
                default: ""
        },
        user: {
                type: String,
                default: ""
        },
}) 

ActivitySectionSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  ActivitySectionSchema.set("toJSON", {
    virtuals: true,
  });
  
  ActivitySectionSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
  };
  
  module.exports  = mongoose.model("activitysection", ActivitySectionSchema, "activitysection");