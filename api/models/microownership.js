// import package
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MicroownershipSchema = new Schema({
        tokenCount: {
            type: Number,
            default: 0
        },
        name: {
                type: String,
                default: ""
        },
        symbol: {
                type: String,
                default: ""
        },
        decimal : {
            type : Number,
            default : 0
        },
        slot : {
            type : Number,
            default : 0 
        },
        availableSlot : {
          type : Number,
          default : 0
        },
        exchangeAddress : {
            type: String,
            default: ""
        },
        price : {
          type : Number,
          default: 0
        },
        restrictSlot : {
          type : Number,
          default : 0
        },
        bep20token : {
          type : String,
          default : ''
        },
        timestamp: { type: Date, default: Date.now }
}) 

  MicroownershipSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  MicroownershipSchema.set("toJSON", {
    virtuals: true,
  });
  
  MicroownershipSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
  };
  
  module.exports  = mongoose.model("microownership", MicroownershipSchema, "microownership");