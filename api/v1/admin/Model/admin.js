// var package
import mongoose from  'mongoose';
import jwt from  'jsonwebtoken';

// var lib
import config from '../../../config/config';

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    company : {
        type: String,
        default: ""
    },
    phoneCode: {
        type: Number,
        default: ""
    },
    phoneNo: {
        type: Number,
        default: ""
    },
    designation : {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default : ""
    },
    about : {
        type: String,
        default : '',
    },
    normalPassword : {
        type: String,
        default : '',
    },
    profileImage: {
        type: String,
        default: ""
    },
    adminAddress: {
        type: String,
        default: ""
    },
    currAddress : {
        type : String,
        default : ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

AdminSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    console.log("checkkk model",token)
    return `Bearer ${token}`;
};

const Admin = mongoose.model("admin", AdminSchema, "admin");
export default Admin;