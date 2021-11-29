// import package
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// import lib
import config from '../config/config';

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

export default DeleteRecords;