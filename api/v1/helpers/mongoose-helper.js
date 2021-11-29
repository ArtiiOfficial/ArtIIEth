const express = require("express");
const path = require("path");
const router = express.Router();
var request = require("request");
const async = require("async");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

const config = require(path.resolve('./config/config'));

exports.find = async function(data={}){
    var retRes = {};
    try{
        var tableName = (data.tableName)?data.tableName:'';
        var findData = (data.findData)?data.findData:{};
        var selectData = (data.selectData)?data.selectData:{};
        var populateData = (data.populateData)?data.populateData:'';
        var limit = (typeof data.limit != 'undefined')?data.limit:config.limitMax;

        var records = await tableName.find(findData, selectData)
            .populate(populateData)
            .limit(limit)
            .exec();
        retRes.type = 'success';
        retRes.records = records;
    } catch(err) {
        retRes.err = err;
        retRes.type = 'error';
        retRes.msg = 'Error occured, please try again.';
    }
    return retRes;
}

exports.findOne = async function(data={}){
    var retRes = {};
    try{
        var tableName = (data.tableName)?data.tableName:'';
        var findData = (data.findData)?data.findData:{};
        var selectData = (data.selectData)?data.selectData:{};
        var populateData = (data.populateData)?data.populateData:'';

        var record = await tableName.findOne(findData, selectData)
            .populate(populateData)
            .exec();
        retRes.type = 'success';
        retRes.record = record;
    } catch(err) {
        retRes.err = err;
        retRes.type = 'error';
        retRes.msg = 'Error occured, please try again.';
    }
    return retRes;
}

exports.findOneAndUpdate = async function(data={}){
    var retRes = {};
    try{
        var tableName = (data.tableName)?data.tableName:'';
        var findData = (data.findData)?data.findData:{};
        var updateData = (data.updateData)?data.updateData:{};
        var newormulti = (data.newormulti)?data.newormulti:{};

        var record = await tableName.findOneAndUpdate(findData, updateData, newormulti).exec();
        if(record != null) {
            retRes.type = 'success';
            retRes.record = record;
        }
        else {
            retRes.type = 'error';
            retRes.msg = 'Error occured, please try again.';
        }
    } catch(err) {
        retRes.err = err;
        retRes.type = 'error';
        retRes.msg = 'Error occured, please try again.';
    }
    return retRes;
}

exports.findOneAndRemove = async function(data={}){
    var retRes = {};
    try{
        var tableName = (data.tableName)?data.tableName:'';
        var findData = (data.findData)?data.findData:{};

        var record = await tableName.findOneAndRemove(findData).exec();
        if(record != null) {
            retRes.type = 'success';
            retRes.record = record;
        }
        else {
            retRes.type = 'error';
            retRes.msg = 'Error occured, please try again.';
        }
    } catch(err) {
        retRes.err = err;
        retRes.type = 'error';
        retRes.msg = 'Error occured, please try again.';
    }
    return retRes;
}

exports.save = async function(data={}){
    var retRes = {};
    try{
        var tableName = (data.tableName)?data.tableName:'';
        var createData = (data.createData)?data.createData:{};

        var saveData = new tableName(createData);
        var record = await saveData.save();
        if(record!=null) {
            retRes.type = 'success';
            retRes.record = saveData;
        }
        else {
            retRes.type = 'error';
            retRes.msg = 'Error occured, please try again.';
        }
    } catch(err) {
        retRes.err = err;
        retRes.type = 'error';
        retRes.msg = 'Error occured, please try again.';
    }
    return retRes;
}