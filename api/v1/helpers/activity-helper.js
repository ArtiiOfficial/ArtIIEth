const express = require("express");
const path = require("path");
const router = express.Router();
var request = require("request");
const async = require("async");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

const config = require(path.resolve('./config/config'));

const ActivityDb = require(path.resolve('./models/activity'));

exports.save = async function(data={}){
    console.log("Activity checking "+JSON.stringify(data))
    var retRes = {};
    try{
        if(data.createData) {
            var createData = data.createData;
            if(createData.action == 'like' || createData.action == 'Follow') {
                var FindData = {};

                if(createData.action == 'like') {
                    FindData['$or'] = [
                        {action : 'like'},
                        {action : 'unlike'}
                    ]
                }
                else if(createData.action == 'Follow') {
                    FindData['$or'] = [
                        {action : 'Follow'},
                        {action : 'Un-Follow'}
                    ]
                }
                FindData.from = createData.from;
                FindData.tokenCounts = createData.tokenCounts;
                var UpdateData = {};
                UpdateData.status = 'old';
                await ActivityDb.update(
                    FindData,
                    { $set: UpdateData },
                    { multi: true }
                )
                .exec()
            }
            if(createData.action == 'mint'){
              createData=createData
            }
            var saveData = new ActivityDb(createData);
            var record = await saveData.save();
            if(record!=null) {
                retRes.type = 'success';
                retRes.record = saveData;
            }
            else {
                retRes.type = 'error';
                retRes.msg = 'Error occured, please try again.';
            }
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
    console.log('retRes : ', retRes);
    return retRes;
}