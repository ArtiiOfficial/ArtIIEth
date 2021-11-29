import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Double from 'bson';
import config from '../config/config';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
var bidSchema = mongoose.Schema({
    tokenBidAmt: {
        type: Number,
        required: true
    },
    tokenBidAddress: {
        type: String,
        required: true,
    },
    tokenCounts: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
    },
    deleted: {
        type: Number,
        default: 1, // 1 Active 0 Deleted
    },
    NoOfToken: {
        type: Number,
        default: 0
    },
    completed: {
        type: Number,
        default: 0
    },
    cancelled: {
        type: Number,
        default: 0
    },
    pending: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

bidSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

bidSchema.set("toJSON", {
    virtuals: true,
});

bidSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

var bidings = mongoose.model("bidings", bidSchema);
module.exports = bidings;
