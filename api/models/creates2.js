import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TokenSchema = new Schema({
  name: {
    type: String,
    default: "",
  },
   tokenPrice:{
     type: Number,
    default: 0, 
   },
   tokencount:{
    type: Number,
    default: 0,
   },
   tokenroyality:{
    type: Number,
    default: 0,
   },
   tokendesc:{
    type: String,
    default: "",
   },
   tokentype:{
    type: String,
    default: "",
   },
   tokenimage:{
     type: String,
    default: "",
   },
    deleted : {
    type: Number,
    default: 1, // 1 Active 0 Deleted
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

TokenSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

TokenSchema.set("toJSON", {
  virtuals: true,
});

TokenSchema.methods.generateJWT = function (payload) {
  var token = jwt.sign(payload, config.secretOrKey);
  return `Bearer ${token}`;
};

module.exports  = mongoose.model("token", TokenSchema, "token");
