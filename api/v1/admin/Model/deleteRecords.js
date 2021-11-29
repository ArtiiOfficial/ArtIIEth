// var package
var mongoose =require( 'mongoose');
var jwt =require( 'jsonwebtoken');

// var lib
var config =require( '../../../config/config');

const Schema = mongoose.Schema;

const DeleteRecordsSchema = new Schema({
    trxid: {
        type: String,      
        default: ""
    },      
    createdAt: {
        type: Date,
        default: Date.now
    }
})

DeleteRecordsSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

const DeleteRecords = mongoose.model("deleteRecords", DeleteRecordsSchema, "deleteRecords");

exports.module= DeleteRecords;