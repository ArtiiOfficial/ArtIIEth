import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Double from 'bson';
import config from '../config/config';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
var contractSchema = mongoose.Schema({
    imageUser: {
        type: String,
        default:""
    },
    name: {
        type: String,
        required: true
    },

    symbol: {
        type: String,
        required: true,

    },
    desc: {
        type: String,
        required: true

    },
    owneraddr: {
        type: String,
        required: true
    },
    conAddr: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        default:""
        // required: true
    },
    deleted: {
        type: Number,
        default: 1, // 1 Active 0 Deleted
    },
    url: {
        type: String,
        required: true
    },
    timestamp: { type: Date, default: Date.now }
});

contractSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

contractSchema.set("toJSON", {
    virtuals: true,
});

contractSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

var contracts = mongoose.model("contracts", contractSchema);
module.exports = contracts;

