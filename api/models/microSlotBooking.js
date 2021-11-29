// import package
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MicroSlotBookingSchema = new Schema({
        tokenCount: {
            type: Number,
            default: 0
        },
        buyerAddress : {
            type : String,
            default : ''
        },
        buyerSlot : {
            type : Number,
            default : 0
        },
        claim : {
            type : Boolean,
            default : false
        },
        timestamp: { type: Date, default: Date.now }
}) 

    MicroSlotBookingSchema.virtual("id").get(function () {
        return this._id.toHexString();
    });
  
    MicroSlotBookingSchema.set("toJSON", {
        virtuals: true,
    });
  
    MicroSlotBookingSchema.methods.generateJWT = function (payload) {
        var token = jwt.sign(payload, config.secretOrKey);
        return `Bearer ${token}`;
    };
  
    module.exports  = mongoose.model("Microslotbooking", MicroSlotBookingSchema, "Microslotbooking");