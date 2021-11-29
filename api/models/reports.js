var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var Double = require('bson');
var config = require('../config/config');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var ReportSchema = mongoose.Schema({
    imageName: {
        type: String,
        default:""
    },
    imagehash: {
        type: String,
        default: "",
    },
    currAddr: {
        type: String,
        required: true,
    },
    imageOwner: {
        type: String,
        default: ""
    },
    imageId: {
        type: Number,
        default: ""
    },
    imageType: {
        type: Number,
        default: ""
    },
    imageContractAddress: {
        type: String,
        default: ""
    },
    report: {
        type: String,
        default: ""
    },
    noofitems: {
        type: Number,
        default: ""
    },
    burnToken:{
        type: Number,
        default: 0 
    },
   
    CreatedAt: { type: Date, default: Date.now }
});

ReportSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

ReportSchema.set("toJSON", {
    virtuals: true,
});

ReportSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

var reports = mongoose.model("reports", ReportSchema);
module.exports = reports;
