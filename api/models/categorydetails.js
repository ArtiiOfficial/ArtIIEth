// import package
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// import lib
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CategorydetailsSchema = new Schema({

  categoryid: {
   type: Schema.Types.ObjectId,
       default:"",
       ref: "category",
  },
   tokenid: {
   type: Schema.Types.ObjectId,
       default:"",
       ref: "token",
  },
  image: {
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

CategorydetailsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CategorydetailsSchema.set("toJSON", {
  virtuals: true,
});

CategorydetailsSchema.methods.generateJWT = function (payload) {
  var token = jwt.sign(payload, config.secretOrKey);
  return `Bearer ${token}`;
};

module.exports  = mongoose.model("categorydetails", CategorydetailsSchema, "categorydetails");
