var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var Double = require('bson');
var config = require('../config/config');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var TokenSchema = mongoose.Schema({

        tokenId: {
                type: Number,
                default: 60050
        },

        timestamp: { type: Date, default: Date.now }
});

TokenSchema.virtual("id").get(function () {
        return this._id.toHexString();
});

TokenSchema.set("toJSON", {
        virtuals: true,
});

TokenSchema.methods.generateJWT = function (payload) {
        var token = jwt.sign(payload, config.secretOrKey);
        return `Bearer ${token}`;
};

var tokenIdtable = mongoose.model("tokenIdtable", TokenSchema);
module.exports = tokenIdtable;
