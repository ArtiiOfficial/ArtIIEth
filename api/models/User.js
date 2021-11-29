// import package
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// import lib
import config from '../config/config';

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  _id : {
    type: String,
    required : true
  },
  name: {
    type: String,
    default: "",
  },
  personalsite: {
    type: String,
    default: "",
  },
    customurl: {
    type: String,
    default: "",
  },
    bio: {
    type: String,
    default: "",
  },
    twitter: {
    type: String,
    default: "",
  },
    instagram: {
    type: String,
    default: "",
  },
    facebook: {
    type: String,
    default: "",
  },
   instagram: {
    type: String,
    default: "",
  },
   youtube: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    // required: true
  },
  image:{
    type: String,
    default: "",
  },
  coverimage:{
    type: String,
    default: "",
  },
  curraddress:{
   type: String,
    default: "",
  },
  fields : {
    type : Array,
    default : []
  },
  date: {
    type: Date,
    default: Date.now,
  },
  deleted : {
    type: Number,
    default: 1, // 1 Active 0 Deleted
  },
  
}, { _id: false });

// UserSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.methods.generateJWT = function (payload) {
  var token = jwt.sign(payload, config.secretOrKey);
  return `Bearer ${token}`;
};

module.exports  = mongoose.model("users", UserSchema, "users");
