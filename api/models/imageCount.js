import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Double from 'bson';
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var imageCountSchema = mongoose.Schema({

    tokenCounts: {
        type: Number,
        required: true,
    },

    count: {
        type: Number,
        default: 0
    },
    tokenOwner: {
        type: String,
        default: 0
    },
    timestamp: { type: Date, default: Date.now }
});

imageCountSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

imageCountSchema.set("toJSON", {
    virtuals: true,
});

imageCountSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

var imageCount = mongoose.model("imageCount", imageCountSchema);
module.exports = imageCount;
