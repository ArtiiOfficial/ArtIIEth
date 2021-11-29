import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Double from 'bson';
import config from '../config/config';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
var collectionSchema = mongoose.Schema({
    image: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false,
    },
    symbol : {
        type: String,
        required: false,
    },
    description : {
        type: String,
        required: false,
    },
    shortUrl : {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
    conAddr: {
        type: String,
        required: true
    }
});

collectionSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

collectionSchema.set("toJSON", {
    virtuals: true,
});

collectionSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

var collections = mongoose.model("collections", collectionSchema);
module.exports = collections;