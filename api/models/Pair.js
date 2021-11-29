// import package
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// import lib
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SwappairSchema = new Schema({
  name: {
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

SwappairSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

SwappairSchema.set("toJSON", {
  virtuals: true,
});

SwappairSchema.methods.generateJWT = function (payload) {
  var token = jwt.sign(payload, config.secretOrKey);
  return `Bearer ${token}`;
};

module.exports  = mongoose.model("swappair", SwappairSchema, "swappair");
