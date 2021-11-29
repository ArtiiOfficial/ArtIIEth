// import package
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FollowerSchema = new Schema({
    userAddress: {
        type: String,
        default: "",
      },
      followerAddress: {
        type: String,
        default: "",
      }
}) 

FollowerSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  FollowerSchema.set("toJSON", {
    virtuals: true,
  });
  
  FollowerSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
  };
  
  module.exports  = mongoose.model("followers", FollowerSchema, "followers");