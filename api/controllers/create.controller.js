

import express from 'express';

import fs from 'fs'
import myItemAddr from '../models/Token';

import Token from '../models/Token';
import users from '../models/User';
import bidings from '../models/bid';
import User721 from '../models/contract';
import resizeImg from 'resize-img';

import Category from '../models/category';

import tokenOwners from '../models/TokenOwner';
import tokenIdtable from '../models/tokenIdtable';

import Like from '../models/like';
// import resizeImg from 'resize-img';

const { ObjectId } = require("mongodb");
import mongoose, { isValidObjectId } from 'mongoose'
import isEmpty from '../config/isEmpty';

//create single collection added
export const create = async (req, res) => {

       //////consol.log("worked")
        var tokenName = req.body.tokenName;
        var tokenCounts = req.body.tokenCounts;
        var tokenDesc = req.body.tokenDesc;
        var tokenPrice = req.body.tokenPrice;
        var tokenRoyality = req.body.tokenRoyality;
        var tokenCategory = req.body.tokenCategory;
        var tokenBid = req.body.tokenBid;
        var tokenProperty = req.body.tokenProperty;
        var tokenOwner = req.body.tokenOwner;
        var tokenCreator = req.body.tokenCreator;
        var categoryid = req.body.categoryid;
        var tokenQuantity = req.body.tokenQuantity;
        var balance = req.body.balance;
        var contractAddress = req.body.contractAddress;
        var status = req.body.status;
        var hashValue = req.body.hashValue;
        var type = req.body.type;
        var minimumBid = req.body.minimumBid;
        var endclocktime = req.body.endclocktime;
        var clocktime = req.body.clocktime;
        var unlockcontent = req.body.unlockcontent;


        var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
        var image = imageFile
     //consol.log(req.files)

        var took = new Token({
                image: image,
                tokenCounts: tokenCounts,
                tokenName: tokenName,
                tokenDesc: tokenDesc,
                tokenPrice: tokenPrice,
                tokenRoyality: tokenRoyality,
                tokenCategory: tokenCategory,
                tokenBid: tokenBid,
                tokenProperty: tokenProperty,
                tokenOwner: tokenOwner,
                tokenCreator: tokenCreator,
                categoryid: categoryid,
                hashValue: hashValue,
                status: status,
                tokenQuantity: tokenQuantity,
                balance: balance,
                contractAddress: contractAddress,
                type: type,
                minimumBid: minimumBid,
                endclocktime: endclocktime,
                clocktime: clocktime,
                unlockcontent: unlockcontent

        })
        took.save()
                .then((data) => {

                        fs.mkdir('public/nftImg/' + took.tokenCreator, { recursive: true }, function (err) {
                                if (err) return//////consol.log('cannot create public/product_images/ directory');
                               //////consol.log('public/product_images/ directory created');
                        });

                        if (imageFile != "") {
                                var productImage = req.files.image;
                               //////consol.log(productImage)
                                var path = 'public/nftImg/' + took.tokenCreator + '/' + imageFile;
                                var thumbsPath = 'public/nftImg/' + took.tokenCreator + '/resizeImg/' + '/' + imageFile;
                                var videoPath = 'public/nftImg/' + took.tokenCreator + '/video/' + '/' + imageFile;
                                productImage.mv(path, function (err) {
                                        if (err) return  //consol.log(err);
                                       //////consol.log('ok')
                                       //////consol.log("$$$$$$$$$$ extension $$$$$$$               :" + imageFile.split('.').pop())

                                });



                        }
                        res.json({ "success": "updated", data });
                       //////consol.log(data)

                })
                .catch((e) => {
                        return res.status(200).json({ "success": "fail", "errors":e });
                })


}

export const tokenOwnerAdd = async (req, res) => {


        var tokenCounts = req.body.tokenCounts;
        var tokenOwner = req.body.tokenOwner;
        var tokenPrice = req.body.tokenPrice;
        var balance = req.body.balance;
        var contractAddress = req.body.contractAddress;
        var hashValue = req.body.hashValue;
        var status = req.body.status;
        var type = req.body.type;
        var tooky = new tokenOwners({
                tokenCounts: tokenCounts,
                tokenOwner: tokenOwner,
                tokenPrice: tokenPrice,
                balance: balance,
                contractAddress: contractAddress,
                hashValue: hashValue,
                status: status,
                type: type
        })
        tooky.save()
                .then((data) => {
                        res.json({ "success": "updated", data });
                       //////consol.log(data)

                })
                .catch((e) => {
                        return res.status(200).json({ "success": "fail", e });
                })


}

export const show = async (req, res) => {
        // if (req.body.currAddr != "") {
                var userBalance = await Token.aggregate([
                        { $sort: { "timestamp": -1 } }, { $limit: 12 },
                        { $match: { "$and": [{ "$and": [{ "tokenPrice": { "$ne": parseFloat(0) }, "tokenOwner": { "$ne": req.body.currAddr } }], "status": "true" }] } },
                        {
                                $project: {
                                        _id: 1,
                                        tokenPrice: 1,
                                        image: 1,
                                        tokenCounts: 1,
                                        tokenOwner: 1,
                                        tokenCreator: 1,
                                }
                        }

                ], (err, data) => {
                        if (err) return//////consol.log("err" + err)
                        res.json(data)
                        //consol.log("user######################################################" + JSON.stringify(data))

                })
        // }


        // else {
        //         var userBalance = await Token.aggregate([
        //                 { $sort: { "timestamp": -1 } }, { $limit: 12 },
        //                 { $match: { "$and": [{ "tokenPrice": { "$ne": parseFloat(0) }, "status": "true" }] } },
        //                 {
        //                         $project: {
        //                                 _id: 1,
        //                                 tokenPrice: 1,
        //                                 image: 1,
        //                                 tokenCounts: 1,
        //                                 tokenOwner: 1,
        //                                 tokenCreator: 1,
        //                         }
        //                 }

        //         ], (err, data) => {
        //                 if (err) return//////consol.log("err" + err)
        //                 res.json(data)
        //                 console.log("user######################################################" + JSON.stringify(data))

        //         })

        // }

}

export const showOwner = async (req, res) => {

        var filter = req.params.tokenCounts
        var owners = await tokenOwners.aggregate([
                {
                        $match: { tokenCounts: Number(filter) }
                },
                { $sort: { "timestamp": -1 } },
                {
                        $lookup:
                        {
                                from: "users",
                                localField: "tokenOwner",
                                foreignField: "curraddress",
                                as: "ownerinfo"
                        },
                },
                {
                        $unwind: {
                                path: '$ownerinfo',
                                preserveNullAndEmptyArrays: true,
                        }
                },

                {
                        $project: {
                                _id: 1,
                                tokenPrice: 1,
                                deleted: 1,
                                tokenCounts: 1,
                                tokenOwner: 1,
                                timestamp: 1,
                                ownerinfo: {
                                        _id: "$ownerinfo._id",
                                        image: "$ownerinfo.image",
                                        name: "$ownerinfo.name",
                                        curraddress: "$ownerinfo.curraddress",
                                        customurl: "$ownerinfo.customurl"
                                }
                                // ownerinfo: "$ownerinfo"
                        }
                }

        ], (err, data) => {
                if (err) return//////consol.log("err" + err)
                res.json(data)
        })
       //////consol.log(owners)

}
export const getpopular = async (req, res) => {
       //////consol.log("111111")

        Category.find({ deleted: 1 }).sort({ tokenCounts: -1 }).exec(function (err, userData) {
               //////consol.log("userDat111111111a", userData)
                // var transaction = [];
                // for (var i = 0; i < userData.length; i++) {
                //   transaction.push({
                //     // image:userData[i].image,
                //     // createdAt:userData[i].createdAt,
                //     name: userData[i].categoryid.name,
                //     id: userData[i]._id

                //   })
                // }
                if (err) {
                        return res
                                .status(200)
                                .json({ success: false, errors: { messages: "Error on server" } });
                }

                return res
                        .status(200)
                        .json({ success: true, userValue: userData });
        });
}
export const dummyinfo = async (req, res) => {
       //////consol.log("####################################################################################################")
       //////consol.log("params val :" + req.params.tokenCounts)
       //////consol.log("####################################################################################################")
        Token.find({ "tokenCounts": req.params.tokenCounts })
                .then((data) => {
                        res.json(data)
                       //////consol.log(data)
                })
                .catch((e) => {
                        res.json({ "err ": e })
                })
}
//update
export const update = async (req, res) => {
        var reqid = req.body.tokenCounts;
        var tokenOwn = req.body.tokenOwner;
        var tokenPri = req.body.tokenPrice;
       //////consol.log(reqid + "        :          " + tokenOwn + "    :       " + tokenPri)
        Token.findOneAndUpdate({ tokenCounts: reqid }, { $set: { tokenOwner: tokenOwn, tokenPrice: tokenPri } })
                .then((data) => {
                        res.json(data)
                })
                .catch((e) => {
                        res.json({ "err ": e })
                })

}

export const updateTokenOwner = async (req, res) => {
        var reqid = req.body.tokenCounts;
        var tokenOwn = req.body.tokenOwner;
        var tokenPri = req.body.tokenPrice;
       //////consol.log(reqid + "        :          " + tokenOwn + "    :       " + tokenPri)

        var newOwner = new tokenOwners({
                tokenCounts: reqid,
                tokenOwner: tokenOwn,
                tokenPrice: tokenPri

        })

        newOwner.save()
                .then((data) => {
                        res.json(data)
                })
                .catch((e) => {
                        res.json({ "err ": e })
                })

}




export const buyAddTokenOwner = async (req, res) => {
        var reqid = req.body.tokenCounts;
        var tokenOwn = req.body.tokenOwner;
        var tokenPri = req.body.tokenPrice;
        var balance = req.body.balance;
        var contractAddress = req.body.contractAddress;
       //////consol.log(reqid + "        :          " + tokenOwn + "    :       " + tokenPri)

        var newOwner = new tokenOwners({
                tokenCounts: reqid,
                tokenOwner: tokenOwn,
                tokenPrice: tokenPri,
                contractAddress: contractAddress,
                balance: balance

        })

        newOwner.save()
                .then((data) => {
                        res.json(data)
                })
                .catch((e) => {
                        res.json({ "err ": e })
                })

}

export const showAllwithProfile = async (req, res) => {
        var filter = req.params.tokenCounts
        var userBalance = await Token.aggregate([
                {
                        $match: { tokenCounts: Number(filter), tokenOwner: String(req.params.tokenOwner) }
                },
                {
                        $lookup:
                        {
                                from: "users",
                                localField: "tokenOwner",
                                foreignField: "curraddress",
                                as: "usersinfo"
                        },
                },
                {
                        $unwind: {
                                path: '$usersinfo',
                                preserveNullAndEmptyArrays: true,
                        }
                },
                {
                        $lookup:
                        {
                                from: "users",
                                localField: "tokenCreator",
                                foreignField: "curraddress",
                                as: "creatorinfo"
                        },
                },
                {
                        $unwind: {
                                path: '$creatorinfo',
                                 preserveNullAndEmptyArrays: true,
                        }
                },
                {
                        $project: {
                                _id: 1,
                                tokenDesc: 1,
                                tokenPrice: 1,
                                tokenCategory: 1,
                                deleted: 1,
                                image: 1,
                                tokenCounts: 1,
                                tokenName: 1,
                                tokenRoyality: 1,
                                tokenBid: 1,
                                tokenProperty: 1,
                                tokenOwner: 1,
                                tokenCreator: 1,
                                categoryid: 1,
                                status: 1,
                                hashValue: 1,
                                balance: 1,
                                tokenQuantity: 1,
                                timestamp: 1,
                                contractAddress: 1,
                                type: 1,
                                likecount:1,
                                minimumBid: 1,
                                unlockcontent:1,
                                endclocktime: 1,
                                clocktime: 1,
                                usersinfo: {
                                        _id: "$usersinfo._id",
                                        image: "$usersinfo.image",
                                        name: "$usersinfo.name",
                                        curraddress: "$usersinfo.curraddress",
                                        customurl:"$usersinfo.customurl"

                                        },
                                creatorinfo: {
                                        _id: "$creatorinfo._id",
                                        image: "$creatorinfo.image",
                                        name: "$creatorinfo.name",
                                        curraddress: "$creatorinfo.curraddress",
                                        customurl: "$creatorinfo.customurl"

                                }
                        }
                }

        ], (err, data) => {
                if (err) return//////consol.log("err" + err)
                res.json(data)
               console.log("!!!!!!!!!!!!!!!!!!!!!!!!!"+JSON.stringify(data))
        })



}

export const showCategory = async (req, res) => {
        var categoryWise = await Category.aggregate([
                {
                        $lookup:
                        {
                                from: "tokens",
                                localField: "name",
                                foreignField: "tokenCategory",
                                as: "info"
                        },
                },
       {
                        $unwind: {
                                path: '$info',
                                preserveNullAndEmptyArrays: true,
                        }
                },

                {
                        $project: {
                                id: 1,
                                name: 1,
                                createdAt: 1,
                                deleted: 1,
                                categoryInfo: "$info"
                        }
                }

        ], (err, data) => {
                if (err) return//////consol.log("err" + err)
                res.json(data)
        })

}
export const tokenVal = async (req, res) => {

        //console.log("Get Token Value From DB")
        var counts = await tokenIdtable.findOne({}).sort({ tokenId: -1 });

        if (counts == null) {

                var tok = new tokenIdtable({
                        tokenId: 50000
                })
                tok.save()
                        .then(data => {
                                console.log(data)
                        })
        }
        else {

                tokenIdtable.findOneAndUpdate({ "tokenId": counts.tokenId }, { "$set": { "tokenId": counts.tokenId + 1 } })

                        .then((data) => {
                                res.json(data);
                                ////////console.log(data)

                        })
                        .catch((e) => {
                                return res.json(e);
                        })

        }

}

//validation

export const valcheck = async (req, res) => {
                console.log('-------------->>>valid',req.body)
                let errors = {}, reqBody = req.body;
                let file = req.files;
                // console.log(file, '----------fileee')
        // console.log("sadsadasdas````````````````````````````````````````````````````" + file.image.name)
                let imageFormat = /\.(png|PNG|gif|WEBP|webp|mpeg|mp4|mp3|video|audio)$/;
                 var tokenfind = await Token.findOne({ "tokenName": reqBody.tokenName })
                if (file == null) {
                        errors.file = "Image is Required"

                } else if (!imageFormat.test(file.image.name)) {
                        errors.file = "Please select valid image."
                } else if (30000000 < file.image.size) {  // 30 MB
                        errors.file = "Too large"
                }

                if (isEmpty(reqBody.name)) {
                        errors.name = "Name field is required";
                }
                if (isEmpty(reqBody.royalties)) {
                        errors.royal = "Royalties field is required";
                }
                if (reqBody.royalties==parseFloat(0)) {
                        errors.royal = "Royalties must be 1 - 99";
                }

                if (isEmpty(reqBody.categoryid)) {
                        errors.categorys = "Category field is required";
                }
                if (reqBody.fixprice == "true") {
                        console.log('price0')
                        if (isEmpty(reqBody.tokenPrice)) {
                                errors.price = "Price must be positive value";
                                console.log('price')
                        }

                        if ((reqBody.tokenPrice) == parseFloat(0)) {
                                errors.price = "Price must be positive value";
                                console.log('price')
                        }
                }
                if (reqBody.timedauctionstate == "true") {
                        console.log('auc1')
                                if (isEmpty(reqBody.minimumBid)) {
                                        errors.minimumbid = "minimum bid is required";
                                        console.log('auc2')
                                }
                                if (isEmpty(reqBody.endclocktime)) {
                                        errors.endtime = "end time is required";
                                        console.log('auc3')
                        }
                        if (reqBody.endclocktime == "Invalid Date" ) {
                                errors.endtime = "end time is ivalid";
                                console.log('auc3')
                        }
                        if (isEmpty(reqBody.clocktime)) {
                                errors.time = "start time is required";
                                console.log('auc4')
                        }
                        if (reqBody.clocktime == "Invalid Date") {
                                errors.time = "start time is invalid";
                                console.log('auc4')
                        }
                        }
                        if (reqBody.unlockEnable == "true") {
                                console.log('price0')
                                if (isEmpty(reqBody.unlockcontent)) {
                                        errors.unlockcontent = "Please enter some special about this image";
                                        console.log('price')
                                }

                }
                if (isEmpty(reqBody.quantity)) {
                        errors.quantity = "Quantity field is required";
                }

                if (tokenfind) {
                        errors.name = "Name Exits"
                }
                console.log("errror!!!!!!!!!", errors);
                if (!isEmpty(errors)) {
                        return res.status(400).json({ "errors": errors });
                }

                //return next()
                return res.status(200).json({ "errors": errors });

}

// 5/20/21


export const addcount1 = async (req, res) => {

        var tokenCounts = req.params.tokenCounts;
        var tokenOwner = req.body.tokenOwner;

        console.log("sadasdsadasd12!!!!!!!!!!!!!!!!!!!!!!!!!aaaaaaaaaaaaaaaaaaa" + JSON.stringify(req.params.tokenOwner))

                Token.findOneAndUpdate({ "tokenCounts": tokenCounts, "tokenOwner": tokenOwner }, { $inc: { "counts": 1 } }, { new: true })

                        .then((data) => {
                                res.json({ "success": "updated", data });
                                console.log("dasssssssssssssssssaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+JSON.stringify(data))

                        })
                        .catch((e) => {
                                return res.status(200).json({ "success": "fail", e });
                        })





}

export const getProfileForCreator = async (req, res) => {
        var filter = req.body.curraddress
       ////consol.log("ful", req.body)
       var result= await users.findOne({ "curraddress": filter })
        if (result != null) {

                ////consol.log(result.id)
                res.json({ "id": ObjectId(result.id), "curraddress": result.curraddress, "image": result.image, "customurl": result.customurl })

        }
        else {
        ////consol.log("empty")
        }
        // }
        // })



}

export const deleteTokenVal = async (req, res) => {
     ////consol.log("hashval@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",req.params.hashValue)
        Token.findOneAndRemove({ "hashValue": req.params.hashValue })
                .then((data) => {
                        res.json(data);


                })
                .catch((e) => {
                        return res.status(200).json({ "success": "fail", e });
                })

}

// less balance in token collection
export const balupdate = async (req, res) => {
        var reqid = req.body.tokenCounts;
        var tokenQuan = req.body.tokenQuan;
        var owner = req.body.tokenOwner;
        var newTokenOwner = req.body.newTokenOwner;

       //////consol.log(reqid + "        :          " + tokenQuan)
        var check = await Token.findOne({ "tokenOwner": newTokenOwner, "tokenCounts": reqid })
        if (check == null) {
                Token.findOne({ "tokenCounts": reqid, "tokenOwner": owner })
                        .then((data) => {
                               //////consol.log("data chceking                      :       " + data)
                                var Upadtebalance = data.balance; //balance update
                                Token.findOneAndUpdate({ "tokenCounts": reqid, "tokenOwner": owner }, { $set: { balance: Upadtebalance - parseInt(tokenQuan) } })
                                        .then((data) => {
                                                res.json(data)
                                               //////consol.log("updateandtoken     :       " + JSON.stringify(data))
                                        })
                                        .catch((e) => {
                                                res.json({ "err ": e })
                                        })

                                // SAVE
                                //create
                                var tokenDesc = data.tokeDesc;
                                var tokenName = data.tokenName;
                                var tokenCounts = data.tokenCounts;
                                var tokenPrice = 0;
                                var tokenRoyality = data.tokenRoyality;
                                var tokenCategory = data.tokenCategory;
                                var tokenBid = true;
                                var tokenProperty = data.tokenProperty;
                                var tokenOwner = newTokenOwner;
                                var tokenCreator = data.tokenCreator;
                                var categoryid = data.categoryid;
                                var tokenQuantity = data.tokenQuantity;
                                var balance = tokenQuan;
                                var contractAddress = data.contractAddress;
                                var status = data.status;
                                var hashValue = data.hashValue;
                                var type = type;
                                var image = data.image


                                var newToken = new Token({
                                        image: image,
                                        tokenCounts: tokenCounts,
                                        tokenName: tokenName,
                                        tokenDesc: tokenDesc,
                                        tokenPrice: tokenPrice,
                                        tokenRoyality: tokenRoyality,
                                        tokenCategory: tokenCategory,
                                        tokenBid: tokenBid,
                                        tokenProperty: tokenProperty,
                                        tokenOwner: tokenOwner,
                                        tokenCreator: tokenCreator,
                                        categoryid: categoryid,
                                        hashValue: hashValue,
                                        status: status,
                                        tokenQuantity: tokenQuantity,
                                        balance: balance,
                                        contractAddress: contractAddress,
                                        type:type


                                })
                                newToken.save()
                                        .then((val) => {
                                                // res.json(val)
                                               //////consol.log("newtoken     :       " + JSON.stringify(data))
                                        })
                                        .catch(e => {
                                               //////consol.log(e)
                                                res.json(e)
                                        })

                        })
                        .catch((e) => {
                               //////consol.log(e)
                                res.json(e)
                        })
        }
        else {
                Token.findOne({ "tokenCounts": reqid, "tokenOwner": owner })
                        .then((data) => {
                               //////consol.log("data chceking                      :       " + data)
                                var Upadtebalance = data.balance; //balance update

                                Token.findOneAndUpdate({ "tokenCounts": reqid, "tokenOwner": owner }, { $set: { balance: Upadtebalance - parseInt(tokenQuan) } })
                                        .then((data) => {
                                                res.json(data)
                                               //////consol.log("updateandtoken     :       " + JSON.stringify(data))
                                        })
                                        .catch((e) => {
                                                res.json({ "err ": e })
                                        })
                                Token.findOneAndUpdate({ "tokenCounts": reqid, "tokenOwner": newTokenOwner }, { $set: { balance: check.balance + parseInt(tokenQuan) } })
                                        .then((data) => {
                                                res.json(data)
                                               //////consol.log("updateandtoken     :       " + JSON.stringify(data))
                                        })
                                        .catch((e) => {
                                                res.json({ "err ": e })
                                        })

                        })

                        .catch(e => {
                                res.json(e)
                               //////consol.log(e)


                        })
        }
}

// upadte qty
export const qtyUpdate = async (req, res) => {
        var reqid = req.body.tokenCounts;
        var tokenQuan = req.body.tokenQuan;
        var owner = req.body.tokenOwner;
        var changeOwner = req.body.newTokenOwner;
        ////consol.log("#######################################################################################################################"+changeOwner)
        var owncheck = await Token.findOne({ "tokenOwner": changeOwner, "tokenCounts": reqid })
        if (owncheck == null) {
              ////consol.log(reqid + "        :          " + tokenQuan)
                Token.findOneAndUpdate({ "tokenCounts": reqid, "tokenOwner": owner }, { $set: { "tokenOwner": changeOwner, tokenPrice: 0 } })
                        .then((data) => {
                                res.json(data)
                             ////consol.log("upadte else " + data)
                        })
                        .catch((e) => {
                                res.json({ "err ": e })
                              ////consol.log(e)
                        })

        }
        else {
                Token.findOneAndUpdate({ "tokenCounts": reqid, "tokenOwner": changeOwner }, { $set: {balance: owncheck.balance+parseInt(tokenQuan), tokenPrice: 0 } })
                        .then((data) => {
                                res.json(data)
                               ////consol.log("upadte else " + data)
                        })
                        .catch((e) => {
                                res.json({ "err ": e })
                               //////consol.log(e)
                        })
                Token.find({ "tokenOwner": owner, "tokenCounts": reqid }).remove()
                        .then(data => {
                                res.json(data)
                               //////consol.log("data"+JSON.stringify(data))
                        })
                        .catch((e) => {
                                res.json({ "err ": e })
                               //////consol.log(e)
                        })


        }


}



export const ownerAddMultiple = async (req, res) => {
        var reqid = req.body.tokenCounts;
        var tokenOwn = req.body.tokenOwner;
        var tokenPri = req.body.tokenPrice;
        var balance1 = req.body.balance;
        var contractAddress = req.body.contractAddress
        var type = req.body.type
        var findowner = await tokenOwners.findOne({ "tokenOwner": tokenOwn, "tokenCounts": reqid })
        if (findowner == null) {
                ////consol.log('ifcoming')
                var newOwner = new tokenOwners({
                        tokenCounts: reqid,
                        tokenOwner: tokenOwn,
                        tokenPrice: tokenPri,
                        balance: balance1,
                        contractAddress: contractAddress,
                        type: type,
                        hashValue: '1',
                        status:'pending'
                })
                // ////consol.log('if ending'+JSON.stringify(newOwner))
                newOwner.save()
                        .then((data) => {
                                res.json(data)
                                // ////consol.log("new owner                                          :" + data)
                        })
                        .catch((e) => {
                                res.json({ "err ": e })
                               //////consol.log(e)
                        })
                // ////consol.log('save ending')
        }
        else {
        //        ////consol.log(typeof findowner.balance, "                     #################"+ typeof parseInt(balance1))
                tokenOwners.findOneAndUpdate({ "tokenOwner": tokenOwn, "tokenCounts": reqid }, { $set: { balance: findowner.balance + parseInt(balance1) } })
                        .then((res) => res.json(data))
                        .catch(e=>res.json(e))

        }
        // ////consol.log('else ending')


}

export const deletemultibid = async (req, res) => {
        var reqid = req.body.tokenCounts;
        var bidderAddr = req.body.bidderAddr;
        var ownerAdd = req.body.tokenOwner;
       ////consol.log('(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((delete multiple working')
        bidings.find({ "tokenCounts": reqid, "ownerAddress": ownerAdd,"tokenBidAddress":bidderAddr }).remove()
                .then(data => {
                        res.json(data)
                      ////consol.log("_________________________________________________________________________________"+data)
                })
                .catch(e => {
                        res.json(e)
                       //////consol.log(e)
                })

}
export const deleteallmultibid = async (req, res) => {
        var reqid = req.body.tokenCounts;
        var tokenOwner = req.body.tokenOwner;
       ////consol.log('delete multiple working')
        bidings.find({ "tokenCounts": reqid, "ownerAddress": tokenOwner}).remove()
                .then(data => {
                        res.json(data)
                      ////consol.log(data)
                })
                .catch(e => {
                        res.json(e)
                       //////consol.log(e)
                })

}


// 29/5

export const allProfileUser = async (req, res) => {
        let limit = req.body.limit ? parseInt(req.body.limit) : 100;
        let skip = parseInt(req.body.skip);
        console.log("hgjghjgjghjguser######################################################" + JSON.stringify(req.body))

         var userBalance = await Token.aggregate([
                 { $match: { "$and": [{ "$and": [{ "tokenOwner": { "$ne": req.body.currAddr }, "status":  "true"  }] }] } },
                 { $sort: { "timestamp": -1 } }, { $skip: skip }, { $limit: limit },

                {
                        $lookup:
                        {
                                from: "users",
                                localField: "tokenOwner",
                                foreignField: "curraddress",
                                as: "tokenuser"
                        },
                },
                {
                        $unwind: {
                                path: '$tokenuser',
                                preserveNullAndEmptyArrays: true,
                        }
                },

                {
                        $lookup:
                        {
                                from: "users",
                                localField: "tokenCreator",
                                foreignField: "curraddress",
                                as: "tokencreatorinfo"
                        },
                },
                {
                        $unwind: {
                                path: '$tokencreatorinfo',
                                preserveNullAndEmptyArrays: true,
                        }
                },
                {
                        $lookup:
                        {
                                from: "contracts",
                                localField: "contractAddress",
                                foreignField: "conAddr",
                                as: "usercontract"
                        },
                 },

                {
                        $unwind: {
                                path: '$usercontract',
                                preserveNullAndEmptyArrays: true,
                        }
                 },


                {
                        $project: {
                                _id: 1,
                                tokenPrice: 1,
                                tokenCategory: 1,
                                image: 1,
                                tokenCounts: 1,
                                tokenName: 1,
                                tokenBid: 1,
                                tokenOwner: 1,
                                tokenCreator: 1,
                                status: 1,
                                hashValue: 1,
                                type:1,
                                balance: 1,
                                tokenQuantity: 1,
                                contractAddress: 1,
                                minimumBid: 1,
                                endclocktime: 1,
                                clocktime: 1,
                                likecount:1,
                                tokenuser: {
                                        _id: "$tokenuser._id",
                                        image: "$tokenuser.image",
                                        name: "$tokenuser.name",
                                        curraddress: "$tokenuser.curraddress",
                                        customurl: "$tokenuser.customurl"
                                },
                                tokencreatorinfo: {
                                        _id: "$tokencreatorinfo._id",
                                        image: "$tokencreatorinfo.image",
                                        name: "$tokencreatorinfo.name",
                                        curraddress: "$tokencreatorinfo.curraddress",
                                        customurl: "$tokencreatorinfo.customurl"
                                },
                                usercontract: {
                                        imageUser: "$usercontract.imageUser",
                                        type:"$usercontract.type",
                                        name: "$usercontract.name",
                                        url:"$usercontract.url",
                                        conAddr:"$usercontract.conAddr"

                                },
                                // bidChcek: '$bidChcek'
                        }
                }

        ], (err, data) => {
                if (err) return//////consol.log("err" + err)
                res.json(data)
                // //consol.log("user######################################################" + JSON.stringify(data))

        })

console.log("user" + JSON.stringify(userBalance))

}


export const changePrice = async (req, res) => {
        var tokenCounts = req.body.tokenCounts;
        var tokenOwner = req.body.tokenOwner;
        var newPrice = req.body.tokenPrice;
        Token.findOneAndUpdate({ "tokenCounts": tokenCounts, "tokenOwner": tokenOwner  },{$set:{"tokenPrice":parseFloat(newPrice)}})
                .then(data => {
                        res.json(data)
                        ////consol.log(data)
                               })
                .catch(e => {
                        res.json(e)
                       //////consol.log(e)
                })

}

export const ownerprice = async (req, res) => {
        var tokenCounts = req.body.tokenCounts;
        var tokenOwner = req.body.tokenOwner;
        var newPrice = req.body.tokenPrice;
        tokenOwners.findOneAndUpdate({ "tokenCounts": tokenCounts, "tokenOwner": tokenOwner }, { $set: { "tokenPrice": parseFloat(newPrice) } })
                .then(data => {
                        res.json(data)
                })
                .catch(e => {
                        res.json(e)
                        //////consol.log(e)
                })

}


export const deleteInstantSale = async (req, res) => {
        var tokenCounts = req.body.tokenCounts;
        var tokenOwner = req.body.tokenOwner;
        var newPrice = req.body.tokenPrice;
        var tokenBid = req.body.tokenBid;
        Token.findOneAndUpdate({ "tokenCounts": tokenCounts, "tokenOwner": tokenOwner }, { $set: { "tokenPrice": parseFloat(newPrice),"tokenBid":tokenBid } })
                .then(data => {
                        res.json(data)
                        ////consol.log(data)
                })
                .catch(e => {
                        res.json(e)
                        //////consol.log(e)
                })

}
// check it
export const getBuyer = async (req, res) => {
  var name = req.params.name
  console.log("dasdasdasdasdas```````````````````````````"+name)
  users.findOne({"curraddress":req.params.name})
  .then((data) => {
      res.json(data)
      console.log("dasdasdasdasdas````````````````````````````````````````" + JSON.stringify(data))
  })
  .catch((e) => {
    res.json({ "err ": e })
  })
}



export const usercontractcheck = async (req, res) => {

        var conAddr = req.body.currAddr
        var type = req.body.type;
        //consol.log(req.body)
        User721.findOne({ "owneraddr": conAddr,"type":type })
                .then((data) => {
                        res.json(data)
                })
                .catch((e) => {
                        res.json({ "err ": e })
                })

}

export const autoSaveData = async (req, res) => {
        var tokenName = req.body.tokenName
        var tokenDesc = req.body.tokenDesc;
        var tokenPrice = req.body.tokenPrice;
        var tokenCategory = req.body.tokenCategory;
        var tokenBid = req.body.tokenBid;
        var tokenRoyality = req.body.tokenRoyality;
        var tokenProperty = req.body.tokenProperty;
        var tokenQuantity = req.body.tokenQuantity;
        //consol.log(conAddr)

        var took = new autosave({
                image: image,
                tokenCounts: tokenCounts,
                tokenName: tokenName,
                tokenDesc: tokenDesc,
                tokenPrice: tokenPrice,
                tokenRoyality: tokenRoyality,
                tokenCategory: tokenCategory,
                tokenBid: tokenBid,
                tokenProperty: tokenProperty,
                tokenOwner: tokenOwner,
                tokenCreator: tokenCreator,
                categoryid: categoryid,
                hashValue: hashValue,
                status: status,
                tokenQuantity: tokenQuantity,
                balance: balance,
                contractAddress: contractAddress,
                type: type,

        })
        took.save()
                .then((data) => {

                        fs.mkdir('public/nftImg/' + took.tokenCreator, { recursive: true }, function (err) {
                                if (err) return//////consol.log('cannot create public/product_images/ directory');
                                //////consol.log('public/product_images/ directory created');
                        });

                        if (imageFile != "") {
                                var productImage = req.files.image;
                                //////consol.log(productImage)
                                var path = 'public/nftImg/' + took.tokenCreator + '/' + imageFile;
                                var thumbsPath = 'public/nftImg/' + took.tokenCreator + '/resizeImg/' + '/' + imageFile;
                                var videoPath = 'public/nftImg/' + took.tokenCreator + '/video/' + '/' + imageFile;
                                productImage.mv(path, function (err) {
                                        if (err) return //consol.log(err);
                                        //////consol.log('ok')
                                        //////consol.log("$$$$$$$$$$ extension $$$$$$$               :" + imageFile.split('.').pop())

                                });



                        }
                        res.json({ "success": "updated", data });
                        //////consol.log(data)

                })
                .catch((e) => {
                        return res.status(200).json({ "success": "fail", "errors": e });
                })



}


export const liveauction = async (req, res) => {
//       console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"+req.body.currAddr)
        var userBalance = await Token.aggregate([
                {
                        $match: {
                                "$and": [
                                        { "$and": [{ "clocktime": { "$ne": null }, "endclocktime": { "$ne": null } }] },

                                        { "$and": [{ "tokenOwner": { "$ne": req.body.currAddr }, "status": { "$eq": "true" }  }] }
                                ]
                        }
                },

                { $sort: { "endclocktime": 1 } }, { $limit: 12 },

                {
                        $lookup:
                        {
                                from: "users",
                                localField: "tokenOwner",
                                foreignField: "curraddress",
                                as: "tokenuser"
                        },
                },
                {
                        $unwind: {
                                path: '$tokenuser',
                                preserveNullAndEmptyArrays: true,
                        }
                },

                {
                        $lookup:
                        {
                                from: "users",
                                localField: "tokenCreator",
                                foreignField: "curraddress",
                                as: "tokencreatorinfo"
                        },
                },
                {
                        $unwind: {
                                path: '$tokencreatorinfo',
                                preserveNullAndEmptyArrays: true,
                        }
                },
                {
                        $lookup:
                        {
                                from: "contracts",
                                localField: "contractAddress",
                                foreignField: "conAddr",
                                as: "usercontract"
                        },
                },
                {
                        $unwind: {
                                path: '$usercontract',
                                preserveNullAndEmptyArrays: true,
                        }
                },

                {
                        $project: {
                                _id: 1,
                                tokenDesc: 1,
                                tokenPrice: 1,
                                tokenCategory: 1,
                                deleted: 1,
                                image: 1,
                                tokenCounts: 1,
                                tokenName: 1,
                                tokenRoyality: 1,
                                tokenBid: 1,
                                tokenProperty: 1,
                                tokenOwner: 1,
                                tokenCreator: 1,
                                categoryid: 1,
                                status: 1,
                                hashValue: 1,
                                type:1,
                                balance: 1,
                                tokenQuantity: 1,
                                contractAddress: 1,
                                minimumBid: 1,
                                endclocktime: 1,
                                likecount:1,
                                clocktime: 1,
                                tokenuser: {
                                        _id: "$tokenuser._id",
                                        image: "$tokenuser.image",
                                        name: "$tokenuser.name",
                                        curraddress: "$tokenuser.curraddress",
                                        customurl:"$tokenuser.customurl"

                                },
                                tokencreatorinfo: {
                                        _id: "$tokencreatorinfo._id",
                                        image: "$tokencreatorinfo.image",
                                        name: "$tokencreatorinfo.name",
                                        curraddress: "$tokencreatorinfo.curraddress",
                                        customurl: "$tokencreatorinfo.customurl"
                                },
                                usercontract: "$usercontract",
                                // bidChcek: '$bidChcek'
                        }
                }

        ], (err, data) => {
                if (err) return//////consol.log("err" + err)
                res.json(data)
                // //consol.log("user######################################################" + JSON.stringify(data))

        })

     console.log("user" + JSON.stringify(userBalance))

}

//add Like
export const addLike = async (req, res) => {
        var tokenCounts = req.body.tokenCounts;
        var address = req.body.currAddr;
        var tokenOwner = req.body.tokenOwner;
        //var newPrice = req.body.tokenPrice;
        var add = new Like({
                tokenCounts: tokenCounts,
                useraddress: address
        })
        if (req.body.type == "inc") {
                add.save()
                        .then(data => {
                                res.json(data)
                                ////consol.log(data)
                        })
                        .catch(e => {
                                res.json(e)
                                //////consol.log(e)
                        })
                var update = await Token.findOneAndUpdate({ "tokenCounts": tokenCounts, "tokenOwner": tokenOwner }, { $inc: { likecount: 1 } })
        }
        else {
                var removeLike = await Like.findOneAndRemove({ "tokenCounts": tokenCounts, "useraddress": address })
                var update = await Token.findOneAndUpdate({ "tokenCounts": tokenCounts, "tokenOwner": tokenOwner }, { $inc: { likecount: -1 } })

        }


}
//get Like dat
export const getLikeData = async (req, res) => {
        //consol.log("GeLikeData is working " + req.body.currAddr)
        let address = req.body.currAddr;
        var likedetail = await Like.aggregate([
                { $match: { "useraddress": address } },
                {
                        $project: {

                                tokenCounts: 1,

                        }
                }
        ],
                (err, data) => {
                        if (err) return//////consol.log("err" + err)
                        res.json(data)
                        ////consol.log("user######################################################" + JSON.stringify(data))

                })

}


export const contractmandatory = async (req, res) => {
        // SDFdsfdsf{ "imageUser": "", "name": "", "symbol": "", "desc": "", "url": "" }
        let errors = {}, reqBody = req.body;
        let file = req.files;
        console.log("SDFdsfdsf"+JSON.stringify(reqBody))
        console.log(file, '----------fileee')
        let imageFormat = /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|WEBP|mp4|video)$/;
        var tokenfind = await User721.findOne({ "symbol": reqBody.symbol })
        var urls = await User721.findOne({ "url": reqBody.url })
        if (file == null) {
                errors.file = "Image is Required"
        } else if (!imageFormat.test(file.imageUser.name)) {
                errors.file = "Please select valid image."
        } else if (file.imageUser.size > 30000000) {  // 30 MB
                errors.filec = "Too large"
        }

        if (isEmpty(reqBody.name)) {
                errors.namec = "Name field is required";
        }
        if (isEmpty(reqBody.symbol)) {
                errors.symbolc = "symbol field is required";
        }
        if (isEmpty(reqBody.url)) {
                errors.urlc = "Please enter some special about this image";
                console.log('price')
        }
        if (tokenfind) {
                errors.symbolc = "Symbol Exits"
        }

        if (urls) {
                errors.urlc = "Url Exits"
        }
        console.log("errror!!!!!!!!!", errors);
        if (!isEmpty(errors)) {
                return res.status(200).json({ "errors": errors });
        }

        return res.status(200).json({ "errors": errors });

}


export const usercollection = async (req, res) => {

        var userBalance = await User721.aggregate([
                { $sort: { "timestamp": -1 } }, { $limit: 4 },
                {
                        $project: {
                                _id: 1,
                                name: 1,
                                imageUser: 1,
                                url: 1,
                                conAddr: 1,
                        }
                }

        ], (err, data) => {
                if (err) return//////consol.log("err" + err)
                res.json(data)
                //consol.log("user######################################################" + JSON.stringify(data))

        })

}

export const mostpopular = async (req, res) => {

        var userBalance = await Token.aggregate([
                { $limit: 4 },
                { $sort: { counts: -1 } },
                {
                        $project: {

                                        _id:1,
                                        image:1,
                                        tokenOwner: 1,
                                        tokenCreator: 1,
                                        tokenName:1,
                                        tokenPrice:1,
                                        tokenCounts: 1,
                                        counts:1
                                }
                        }


        ], (err, data) => {
                if (err) return//////consol.log("err" + err)
                res.json(data)
                //consol.log("user######################################################" + JSON.stringify(data))

        })

}

export const topbuyers = async (req, res) => {

        var userBalance = await Token.aggregate([
                { $match: {"tokenOwner":{$ne:Token.tokenOwner } } },
                // { $match: { tokenOwner: { $ne: tokenCreator } } },

                { $limit: 4 },
                {$sort:{tokenPrice:-1}},
                {
                        $lookup:
                        {
                                from: "users",
                                localField: "tokenOwner",
                                foreignField: "curraddress",
                                as: "topbuyerinfo"
                        },
                },
                {
                        $unwind: {
                                path: '$topbuyerinfo',
                                preserveNullAndEmptyArrays: true,
                        }
                },
                {
                        $lookup:
                        {
                                from: "tokens",
                                localField: "tokenOwner",
                                foreignField: "tokenOwner",
                                as: "topinfo"
                        },
                },
                {
                        $unwind: {
                                path: '$topinfo',
                                preserveNullAndEmptyArrays: true,
                        }
                },
                // { $match: { "topinfo.tokenOwner": { $ne: '$topinfo.tokenOwner' } } },
                {
                        $project: {
                                _id: 1,
                                image: 1,
                                tokenOwner: 1,
                                tokenCreator:1,
                                tokenCounts: 1,
                                tokenPrice:1,
                                topbuyerinfo: {
                                        _id: "$topbuyerinfo._id",
                                        image: "$topbuyerinfo.image",
                                        name: "$topbuyerinfo.name",
                                        curraddress: "$topbuyerinfo.curraddress",
                                        customurl: "$topbuyerinfo.customurl"
                                }
                        }
                }


        ], (err, data) => {
                if (err) return//////consol.log("err" + err)
                res.json(data)
                //consol.log("user######################################################" + JSON.stringify(data))

        })

}

export const hotcreators = async (req, res) => {

        var userBalance = await Token.aggregate([
                { $limit: 4 },
                { $sort: {"timestamp": -1} },

                {
                        $project: {
                                _id: 1,
                                image: 1,
                                tokenOwner: 1,
                                tokenCounts: 1,
                                tokenName: 1,
                                tokenPrice: 1,
                                tokenCreator:1,

                        }
                }


        ], (err, data) => {
                if (err) return//////consol.log("err" + err)
                res.json(data)
                //consol.log("user######################################################" + JSON.stringify(data))

        })

}

export const mostliked = async (req, res) => {

        var userBalance = await Token.aggregate([
                { $limit: 4 },
                { $sort: { likecount: -1 } },
                {
                        $project: {

                                _id: 1,
                                image: 1,
                                tokenOwner: 1,
                                tokenCreator: 1,
                                tokenName: 1,
                                tokenPrice: 1,
                                tokenCounts: 1,
                                counts: 1,
                                likecount:1
                        }
                }


        ], (err, data) => {
                if (err) return//////consol.log("err" + err)
                res.json(data)
                //consol.log("user######################################################" + JSON.stringify(data))

        })

}
export const addBuy = async (req, res) => {
        var buyOwner = req.body.buyUser;
        var buyAmount = parseFloat(req.body.amount);
        console.log("BuyAmount " + buyOwner + " " + buyAmount)
        users.findOneAndUpdate({ "curraddress": buyOwner }, {
                $inc: {
                        "buyAmount": buyAmount
                }
        })
                .then((data) => {
                        res.json(data)
                        ////consol.log("upadte else " + data)
                })
                .catch((e) => {
                        res.json({ "err ": e })
                        ////consol.log(e)
                })
}
export const addSale = async (req, res) => {
        var saleUser = req.body.saleUser;
        var saleAmount = parseFloat(req.body.amount);
        console.log("SaleAmount " + saleUser + " " + saleAmount)

        users.findOneAndUpdate({ "curraddress": saleUser }, {
                $inc: {
                        "saleAmount": saleAmount
                }
        }, { new: true })
                .then((data) => {
                        console.log('data', data)
                        res.json(data)
                        ////consol.log("upadte else " + data)
                })
                .catch((e) => {
                        res.json({ "err ": e })
                        ////consol.log(e)
                })


}
