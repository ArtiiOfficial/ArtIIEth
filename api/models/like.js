// import package
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// import lib
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LikesSchema = new Schema({
	tokenCounts: {
		type: Number,
		default: 0
	},
	useraddress: {
		type: String,
		default: ""
	},
	date: {
		type: Date,
		default: Date.now,
	},
	deleted: {
		type: Number,
		default: 1, // 1 Active 0 Deleted
	},

});

LikesSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

LikesSchema.set("toJSON", {
	virtuals: true,
});

LikesSchema.methods.generateJWT = function (payload) {
	var token = jwt.sign(payload, config.secretOrKey);
	return `Bearer ${token}`;
};

module.exports = mongoose.model("likes", LikesSchema, "likes");