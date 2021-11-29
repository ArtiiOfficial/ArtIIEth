import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Double from 'bson';
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var FollowingSchema = mongoose.Schema({
        owner: {
                type: String,
                default: ""
        },
        follower: {
                type: String,
                default: ""
        },
        timestamp: { type: Date, default: Date.now }
});

FollowingSchema.virtual("id").get(function () {
        return this._id.toHexString();
});

FollowingSchema.set("toJSON", {
        virtuals: true,
});

FollowingSchema.methods.generateJWT = function (payload) {
        var token = jwt.sign(payload, config.secretOrKey);
        return `Bearer ${token}`;
};

var tokenOwner = mongoose.model("follow", FollowingSchema);
module.exports = tokenOwner;
