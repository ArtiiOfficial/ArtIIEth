

import express from 'express';
const { ObjectId } = require("mongodb");
import mongoose from 'mongoose'
import bidings from '../models/bid';
import User721 from '../models/contract';
import formidable from 'formidable';
import fs from 'fs';
import config from '../config/config';
//create single collection added
export const add = async (req, res) => {
        ////consol.log("worked")
        ////consol.log("req checking:      "+JSON.stringify(req.body))
        var tokenBidAmt = req.body.tokenBidAmt;
        var tokenBidAddress = req.body.tokenBidAddress;
        var tokenCounts = req.body.tokenCounts;
        var tokenBidWoFee = req.body.tokenBidWoFee;
        var tokenName = req.body.tokenName;
        var tokenServiceFee = req.body.tokenServiceFee;
        var contractAddress = req.body.contractAddress;
        var NOFtoken = req.body.NOFtoken;
        var ownerAddress = req.body.ownerAddress;
        var type = req.body.type;
        // var userval = req.body.userval;
        // ////consol.log(userval)
        var bidadd = new bidings({
                tokenBidAmt: tokenBidAmt,
                contractAddress: contractAddress,
                NOFtoken: NOFtoken,
                tokenBidAddress: tokenBidAddress,
                tokenCounts: tokenCounts,
                tokenBidWoFee: tokenBidWoFee,
                tokenName: tokenName,
                tokenServiceFee: tokenServiceFee,
                ownerAddress: ownerAddress,
                type: type,
              
                // userval: userval,
        })
        bidadd.save()
                .then((data) => {
                        res.json({ "success": "updated", data });
                        ////consol.log(data)

                })
                .catch((e) => {
                         res.status(200).json({ "success": "fail", e });
                        ////consol.log("ghdsjfsd"+e)
                })
        ////consol.log("dsakhdjkas")

}
export const update = async (req, res) => {
        ////consol.log("worked update111111111111111111111111111111111111111111111111111111"+JSON.stringify(req.body))
        var tokenBidAmt = req.body.tokenBidAmt;
        var tokenBidAddress = req.body.tokenBidAddress;
        var tokenCounts = req.body.tokenCounts;
        var tokenBidWoFee = req.body.tokenBidWoFee;
        var tokenName = req.body.tokenName;
        var NOFtoken = req.body.NOFtoken;
        var tokenServiceFee = req.body.tokenServiceFee;
        var tokenOwner = req.body.tokenOwner;
        var type = req.body.type;
        var bidfind = await bidings.findOne({ "tokenCounts": tokenCounts, "tokenBidAddress": tokenBidAddress,"ownerAddress":tokenOwner })
        ////consol.log(bidfind)
        if (bidfind == null) {
                ////consol.log("not work")
        }
        else {
               var data= await bidings.findOneAndUpdate({ "tokenCounts": tokenCounts, "tokenBidAddress": tokenBidAddress, "ownerAddress": tokenOwner }, { $set: { NOFtoken: NOFtoken,tokenBidWoFee: tokenBidWoFee,hahsValue:1,status:"pending"} })
                       
                res.json({ "success": "updated", data });
                ////consol.log("data@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" + JSON.stringify(data))

                      
        }

}
export const show = async (req, res) => {
        ////consol.log("worked show")
        // var tokenCounts = 200
        // ////consol.log(tokenCounts)
        bidings.find({ "tokenCounts": req.params.tokenCounts })
                .then((data) => {
                        res.json(data);
                        ////consol.log(data)

                })
                .catch((e) => {
                        return res.status(200).json({ "success": "fail", e });
                })

}
export const deleteBid = async (req, res) => {
////consol.log(req.params)
        bidings.findOneAndRemove({ tokenCounts: req.params.tokenCounts ,tokenBidAddress:req.params.currAddr})
                .then((data) => {
                        res.json(data);
                        ////consol.log(data)

                })
                .catch((e) => {
                        return res.status(200).json({ "success": "fail", e });
                })

}

export const deleteAcceptedBid = async (req, res) => {

        var fnd = bidings.find({ "tokenCounts": req.params.tokenCounts })
        fnd.remove()
                .then((data) => {
                        res.json(data);
                        ////consol.log(data)

                })
                .catch((e) => {
                        return res.status(200).json({ "success": "fail", e });
                })

}
export const showWithProfile = async (req, res) => {
        ////consol.log("req params :       " + JSON.stringify(req.params))
        var filter = req.params.tokenCounts
        var filter1 = req.params.tokenOwner
        ////consol.log(filter)
        var userBalance = await bidings.aggregate([
                { $sort: { "tokenBidWoFee": -1 } },
                {
                        // { $or: [{ name: 'John' }, { name: 'Smith' }] }
                        $match: { $and: [{ tokenCounts: Number(filter) }, { ownerAddress: String(filter1) }] }
                },
                {
                        $lookup:
                        {
                                from: "users",
                                localField: "tokenBidAddress",
                                foreignField: "curraddress",
                                as: "bidusersinfo"
                        },
                },
                {
                        $unwind: {
                                path: '$bidusersinfo',
                                preserveNullAndEmptyArrays: true,
                        }
                },
                {
                        $project: {
                                _id: 1,
                                deleted: 1,
                                tokenBidAmt: 1,
                                tokenBidAddress: 1,
                                tokenCounts: 1,
                                tokenBidWoFee: 1,
                                tokenName: 1,
                                tokenServiceFee: 1,
                                timestamp: 1,
                                NOFtoken: 1,
                                type:1,
                                contractAddress:1,
                                bidusersinfo: {
                                        _id: "$bidusersinfo._id",
                                        image: "$bidusersinfo.image",
                                        name: "$bidusersinfo.name",
                                        curraddress: "$bidusersinfo.curraddress",
                                }
                        }
                }
                // ])
        ], (err, data) => {
                if (err) return ////consol.log("err" + err)
                res.json(data)
        })
        ////consol.log(userBalance)
}
export const bidProfileCheck = async (req, res) => {
        var filter = req.params.tokenCounts
        var filter1 = req.params.tokenOwner
        var filter2 = req.params.currAddr
        console.log("``````````````````````````````````````````````````````````````````````````````````````````````````" + JSON.stringify(req.params))
        var aww = await bidings.findOne({ "tokenCounts": filter, "ownerAddress": filter1, "tokenBidAddress": filter2 })
        if (aww != null) {
        res.json(aww)
        }
     console.log("``````````````````````````````````````````````````````````````````````````````````````````````````"+JSON.stringify(aww))
}
export const createNewSingle = async (req, res) => {
        
      
        var name = req.body.name;
        var symbol = req.body.symbol;
        var desc = req.body.desc;
        var url = req.body.url;
        var owneraddr = req.body.owneraddr;
        var conAddr = req.body.conAddr;
        var type = req.body.type;
        //consol.log(req.body)

        //consol.log(req.files)
        var imageFile = typeof req.files.imageUser !== "undefined" ? req.files.imageUser.name : "";
        var image = imageFile
        var newcontract =  User721({
                imageUser:image,
                name: name,
                symbol: symbol,
                desc: desc,
                url: config.siteUrl+"/collections/"+url,
                owneraddr: owneraddr,
                conAddr: conAddr,
                type:type
        })

        newcontract.save()
                .then((data) => {
                        res.json(data)
                        //consol.log(data)
                        fs.mkdir('public/userContract/' + data.conAddr, { recursive: true }, function (err) {
                                if (err) return //consol.log('cannot create public/product_images/ directory');
                                //consol.log('public/userContract/ directory created');
                        });
                      
                        if (imageFile != "") {
                                var productImage = req.files.imageUser;
                                //consol.log(productImage)
                                var path = 'public/userContract/' + data.conAddr + '/' + imageFile;

                                productImage.mv(path, function (err) {
                                        if (err) return //consol.log(err);
                                });
                        }               
                })
                .catch((e) => {
                        res.json({ "err ": e })
                })
}
