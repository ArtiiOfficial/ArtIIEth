// import package

// import modal

import User from '../models/User';
import myItemAddr from '../models/myItemAddr';
import Settings from '../v1/admin/Model/settings';
import rebirthSlot from '../models/rebirthSlot';
import Faq from '../v1/admin/Model/faq';
import UserDetails from '../models/userDetails';
import Tranaction from '../models/transaction';
import Admin from '../v1/admin/Model/admin';
import async from 'async';
import moment from 'moment';
import setting from '../v1/admin/Model/settings'
import EmailTemplate from "../v1/admin/Model/emailTemplate";
import { sendEmail } from "../config/emailGateway";
import multer from "multer";
import path from "path";
import mongoose, { now } from 'mongoose';
import bcrypt from 'bcrypt';
import axios from 'axios';
import node2fa from 'node-2fa';
import Category from '../models/category';
import config from '../config/config';
import Token from '../models/Token';
import { generatePassword, comparePassword } from '../lib/bcrypt';
import { settings } from 'cluster';
import Transaction from '../models/transaction';
import e from 'express';
import fs from 'fs'
import Follow from '../models/follow'
import Activity from '../models/activity'
import Contract from '../models/contract';
const ObjectId = mongoose.Types.ObjectId;

import { resolve } from 'url';
/**
 * User Login
 * URL : /api/login
 * METHOD: POST
 * BODY : email, phoneNo, phoneCode, loginType (1-mobile, 2-email), password
*/
export const userLogin = async (req, res) => {
  //////   //  console.log("(req.body)
  try {
    let reqBody = req.body, checkUser;

    reqBody.email = reqBody.email.toLowerCase();
    ////   //  console.log("(reqBody.email);
    checkUser = await User.findOne({ "email": reqBody.email });
    ////   //  console.log("('checkUser', checkUser);
    if (!checkUser) {
      return res.status(400).json({ "success": false, 'errors': { 'email': "Email is not exists" } })
    }

    var passwordStatus = bcrypt.compareSync(reqBody.password, checkUser.password);

    if (!passwordStatus) {
      return res.status(400).json({ "success": false, 'errors': { "password": "Password incorrect" } })
    }

    var loginhistory = {}
    //////   //  console.log("(reqBody.data);
    loginhistory['ip'] = reqBody.data.ip;
    loginhistory['city'] = reqBody.data.city;
    loginhistory['regionName'] = reqBody.data.region;
    loginhistory['country'] = reqBody.data.country;
    loginhistory['loc'] = reqBody.data.loc;
    loginhistory['org'] = reqBody.data.org;
    loginhistory['postal'] = reqBody.data.postal;
    loginhistory['timezone'] = reqBody.data.timezone;
    loginhistory['date'] = Date.now;

    ////   //  console.log("(loginhistory);
    //return false;

    User.update({
      _id: checkUser._id
    }, {
      "$push": {
        "loginhistory": loginhistory
      }
    }).exec(function (err, student) { });

    let payloadData = {
      "_id": checkUser._id
    }
    let token = new User().generateJWT(payloadData);
    let result = {
      '_id': checkUser._id,
      'email': checkUser.email,
      'name': checkUser.name
    }
    // ////   //  console.log("(result);
    return res.status(200).json({ 'success': true, 'message': "Login successfully", token, result })
  }
  catch (err) {
    //////   //  console.log("(err);
    return res.status(500).json({ "success": false, 'errors': { 'messages': "Error on server" } })
  }
}

export const logindemo = async (req, res) => {
  //////   //  console.log("(req.body)
  try {
    let reqBody = req.body, checkUser;

    reqBody.email = reqBody.email.toLowerCase();
    ////   //  console.log("(reqBody.email);
    checkUser = await User.findOne({ "userid": reqBody.email });
    //////   //  console.log("(checkUser,"checkUsercheckUsercheckUsercheckUser");
    if (!checkUser) {
      return res.status(400).json({ "success": false, 'errors': { 'email': "User is not exists" } })
    }

    let result = {
      '_id': checkUser._id,
      'email': checkUser.email,
      'name': checkUser.name
    }
    ////   //  console.log("(result);
    return res.status(200).json({ 'success': true, 'message': "Login successfully", result })
  }
  catch (err) {
    //////   //  console.log("(err);
    return res.status(500).json({ "success": false, 'errors': { 'messages': "Error on server" } })
  }
}

export const useradd = async (req, res) => {

}

export const getrefererdData = async (req, res) => {
  if (req.params.id) {
    var userId = parseInt(req.params.id);
    User.findOne({ userid: userId }, (err, userData) => {
      if (err || userData == null) {
        return res
          .status(500)
          .json({ success: false, errors: { messages: "Error on server" } });
      }
      return res
        .status(200)
        .json({ success: true, result: 1 });

    });
  } else {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};


/**
 * Check Forgot Password
 * METHOD : POST
 * URL : /api/forgotPassword
 * BODY : email
 */
export const checkForgotPassword = (req, res) => {
  let reqBody = req.body;

  User.findOne(
    {
      email: reqBody.email,
    },
    (err, userData) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, errors: { messages: "Error on server" } });
      }
      if (!userData) {
        return res
          .status(400)
          .json({ success: false, errors: { email: "Email is not exists" } });
      }

      let content = {
        name: userData.name,
        confirmMailUrl: `${config.siteUrl}/change-password1/${userData._id}`,
      };
      //////   //  console.log("("User_forgot", userData.email, content);
      mailTemplate("User_forgot", userData.email, content);
      return res.status(200).json({ success: true });
    }
  );
};

/**
 * Change Password
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
 */
export const changeForgotPassword = async (req, res) => {
  //////   //  console.log("(req.body, "sdfdsfdsfsdfdsfdsfsd");
  try {
    let reqBody = req.body;

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(reqBody.password, salt);
    //////   //  console.log("(hash);
    if (!hash) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }

    let userData = await User.findOne({ _id: reqBody.userId });
    if (!userData) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "User not found" } });
    }

    userData.password = hash;
    await userData.save();
    let content = {
      name: userData.name,
    };
    mailTemplate("Password_Changed", userData.email, content);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

/**
 * Change Password
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
 */
export const changePasswordOld = async (req, res) => {
  //////   //  console.log("(req.body, "sdfdsfdsfsdfdsfdsfsd");
  try {
    let reqBody = req.body;

    let check2Fa = node2fa.verifyToken(reqBody.secret, reqBody.otp)
    if (check2Fa == null) {
      return res
        .status(500)
        .json({ success: false, errors: { otp: "Ivalida code" } });
    }

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(reqBody.password, salt);

    if (!hash) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }

    let userData = await User.findOne({ _id: req.user.id });
    if (!userData) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "User not found" } });
    }

    var passwordStatus = bcrypt.compareSync(reqBody.oldpassword, userData.password);
    //////   //  console.log("(passwordStatus,"passwordStatuspasswordStatus")

    if (!passwordStatus) {
      return res.status(400).json({ "success": false, 'errors': { "oldpassword": "Old Password incorrect" } })
    }

    userData.password = hash;
    await userData.save();
    let content = {
      name: userData.name,
    };
    mailTemplate("Password_Changed", userData.email, content);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

var storagekyc1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/user");
  },
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

var upload1 = multer({
  storage: storagekyc1, fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
}).fields([
  { name: "photo", maxCount: 1 }
]);

export const adduser = (req, res, next) => {
  const errors = {};
  upload1(req, res, (err) => {
    if (err) {
      ////   //  console.log("("err1111", err);
      errors.photo = err
      res
        .status(400)
        .json({ success: false, "errors": errors });
    } else {
      ////   //  console.log("('req.files', req.files);

      return next();
    }
  });
}


export const updateuser = async (req, res) => {
  try {
    var reqBody = req.body;
    let checkUser = await User.findOne({ "email": reqBody.email, "_id": { "$ne": new mongoose.Types.ObjectId(req.user.id) } });
    //////   //  console.log("(checkUser);
    if (checkUser) {
      if (checkUser.email == reqBody.email) {
        return res.status(400).json({ "success": false, 'errors': { 'email': "Email already exists" } })
      }
    }

    let checkUser1 = await User.findOne({ "_id": new mongoose.Types.ObjectId(req.user.id) });

    //////   //  console.log("(checkUser1);
    var test = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.user.id) },
      {
        name: reqBody.name,
        email: reqBody.email,
        phonenumber: reqBody.phonenumber,
        address1: reqBody.address1,
        address2: reqBody.address2,
        pincode: reqBody.pincode,
        city: reqBody.city,
        country: reqBody.country,
        Photofile: (req.files && req.files.Photofile) ? req.files.Photofile[0].filename : checkUser1.Photofile,
      }
    );
    return res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully" });
  } catch (err) {
    // ////   //  console.log("("----err", err)
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
}



export const getrecords = async (req, res) => {

  async.parallel({
    withdraw: function (cb) {
      Tranaction.find({ "userId": req.body.id, "transactionType": "Withdraw" }).exec(cb);
    },
    deposit: function (cb) {
      Tranaction.find({ "userId": req.body.id, "transactionType": "Deposit" }).exec(cb);
    },
    refusers: function (cb) {
      User.find({ "refid": req.body.id }).exec(cb);
    },
  }, function (err, results) {
    //  ////   //  console.log("(results.Tranaction[0].mat3[0].amount);
    if (err) {
      return res
        .status(400)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    return res
      .status(200)
      .json({ success: true, userValue: results });
  });
}

//getuserdemo

export const getuserdemo = async (req, res) => {
  var d = new Date();
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();
  var todate = year + "-" + month + "-" + date;
  ////   //  console.log("(todate, "today")
  var userId = parseInt(req.params.id);

  let checkUser = await User.findOne({ userid: userId });
  var userId = checkUser._id;
  async.parallel({
    Tranaction: function (cb) {
      Tranaction.aggregate([
        { '$match': { "userId": ObjectId(userId) } },
        {
          "$facet": {
            "mat3": [
              { '$match': { "matrix": 3, "transactionType": "Referal" } },
              { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
            ],
            "mat6": [
              { '$match': { "matrix": 6, "transactionType": "Referal" } },
              { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
            ],
            "all": [
              { '$match': { "userId": ObjectId(userId) } },

            ],
            "referal": [
              { '$match': { "transactionType": "Referal" } },
            ]
          }
        }
      ]).exec(cb);
    },
    totaluser: function (cb) {
      User.find().count().exec(cb);
    },
    refuser: function (cb) {
      User.find({ "refid": ObjectId(userId) }).count().exec(cb);
    },
    newuser: function (cb) {
      User.find({ "date": { $gte: moment(new Date(todate)).format() } }).count().exec(cb);
    },
    result: function (cb) {
      User.findOne({ _id: userId, deleted: 1 }).exec(cb);
    },
    pearnings: function (cb) {
      Tranaction.aggregate([
        { '$match': { "userId": ObjectId(userId), "transactionType": "Referal" } },
        {
          "$facet": {
            "pear": [
              { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
            ]
          }
        }
      ]).exec(cb);
    },
    matrix: function (cb) {
      UserDetails.aggregate([
        { "$unwind": "$userDet" },
        {
          "$facet": {
            "matrix3": [
              { '$match': { "userDet.matrix": 3, "userDet.id": userId } },
              { "$sort": { "userDet.level": 1 } }
            ],
            "matrix6": [
              { '$match': { "userDet.matrix": 6, "userDet.id": userId } },
              { "$sort": { "userDet.level": 1 } }
            ],
          }
        }
      ]).exec(cb);
    },
  }, function (err, results) {
    // ////   //  console.log("(results.pearnings,"gafhgjhdsgfhsdgfgjhsdgfhjsdgfhgsdfgsd");
    if (err) {
      ////   //  console.log("(err, "sdgdfgdfgdf----------------------------")
      return res
        .status(400)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    return res
      .status(200)
      .json({ success: true, userValue: results });
  });
}

export const getuser = async (req, res) => {

  var d = new Date();
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();
  var todate = year + "-" + month + "-" + date;
  ////   //  console.log("(todate, "today")
  async.parallel({
    Tranaction: function (cb) {
      Tranaction.aggregate([
        { '$match': { "userId": ObjectId(req.user.id) } },
        {
          "$facet": {
            "mat3": [
              { '$match': { "matrix": 3, "transactionType": "Referal" } },
              { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
            ],
            "mat6": [
              { '$match': { "matrix": 6, "transactionType": "Referal" } },
              { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
            ],
            "all": [
              { '$match': { "userId": ObjectId(req.user.id) } },

            ],
            "referal": [
              { '$match': { "transactionType": "Referal" } },
            ]
          }
        }
      ]).exec(cb);
    },
    totaluser: function (cb) {
      User.find().count().exec(cb);
    },
    refuser: function (cb) {
      User.find({ "refid": ObjectId(req.user.id) }).count().exec(cb);
    },
    newuser: function (cb) {
      User.find({ "date": { $gte: moment(new Date(todate)).format() } }).count().exec(cb);
    },
    result: function (cb) {
      User.findOne({ _id: req.user.id, deleted: 1 }).exec(cb);
    },
    pearnings: function (cb) {
      Tranaction.aggregate([
        { '$match': { "userId": ObjectId(req.user.id), "transactionType": "Referal" } },
        {
          "$facet": {
            "pear": [
              { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
            ]
          }
        }
      ]).exec(cb);
    },
    matrix: function (cb) {
      UserDetails.aggregate([
        { "$unwind": "$userDet" },
        {
          "$facet": {
            "matrix3": [
              { '$match': { "userDet.matrix": 3, "userDet.id": req.user.id } },
              { "$sort": { "userDet.level": 1 } }
            ],
            "matrix6": [
              { '$match': { "userDet.matrix": 6, "userDet.id": req.user.id } },
              { "$sort": { "userDet.level": 1 } }
            ],
          }
        }
      ]).exec(cb);
    },
  }, function (err, results) {
    // ////   //  console.log("(results.pearnings,"gafhgjhdsgfhsdgfgjhsdgfhjsdgfhgsdfgsd");
    if (err) {
      ////   //  console.log("(err, "sdgdfgdfgdf----------------------------")
      return res
        .status(400)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    return res
      .status(200)
      .json({ success: true, userValue: results });
  });
}

export const getcountforhome = async (req, res) => {

  var d = new Date();
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();
  var todate = year + "-" + month + "-" + date;
  ////   //  console.log("(todate, "today")

  async.parallel({

    totaluser: function (cb) {
      User.find().count().exec(cb);
    },
    refuser: function (cb) {
      User.find({}).count().exec(cb);
    },
    newuser: function (cb) {
      User.find({ "date": { $gte: moment(new Date(todate)).format() } }).count().exec(cb);
    },
    pearnings: function (cb) {
      Tranaction.aggregate([
        { '$match': { "transactionType": "Referal" } },
        {
          "$facet": {
            "pear": [
              { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
            ]
          }
        }
      ]).exec(cb);
    },
  }, function (err, results) {
    //////   //  console.log("(results.pearnings[0].pear[0].amount,"gafhgjhdsgfhsdgfgjhsdgfhjsdgfhgsdfgsd");
    if (err) {
      ////   //  console.log("(err, "sdgdfgdfgdf----------------------------")
      return res
        .status(400)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    return res
      .status(200)
      .json({ success: true, userValue: results });
  });
}

export const getfees = async (req, res) => {

  setting.findOne({}).exec(function (err, results) {
    if (err) {
      return res
        .status(400)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    ////   //  console.log("(results, "==========================================================")
    return res
      .status(200)
      .json({ success: true, userValue: results });
  });
}


export const getSettings = async (req, res) => {

  Settings.findOne({}, (err, userData) => {
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

export const getprofile = async (req, res) => {
  var reqBody = req.body;

  User.findOne({ 'curraddress': reqBody.currAddr }, (err, userData) => {
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

export const getAllProfile = async (req, res) => {

  User.find({})
    // .sort({ _id: -1 })
    .then((ye) => {
      res.json(ye);
    })

    .catch(e => res.json({ success: false, errors: { messages: "Error on server" } }))
}
// routes.get('/home', (req, res) => {
export const home = async (req, res) => {
  Category.find({}).exec(function (err, data) {
    if (err) {
      return res
        .status(200)
        .json({ success: false, errors: "Error on server" });
    }
    return res
      .status(200)
      .json(data);
  });
}
// )
export const categorylist = async (req, res) => {
  var reqBody = req.body.name;
  ////   //  console.log("("reqBody", reqBody)
  let categoryData = await Category.findOne({ "name": reqBody });
  if (categoryData) {
    ////   //  console.log("("categoryData._id", categoryData)

    Token.find({ categoryid: new mongoose.Types.ObjectId(categoryData._id) })
      .populate('categoryid')
      .exec(function (err, userData) {
        var transaction = [];
        for (var i = 0; i < userData.length; i++) {
          transaction.push({
            image: userData[i].image,
            tokenCounts: userData[i].tokenCounts,
            tokenName: userData[i].tokenName,
            tokenDesc: userData[i].tokenDesc,
            tokenPrice: userData[i].tokenPrice,
            tokenRoyality: userData[i].tokenRoyality,
            tokenBid: userData[i].tokenBid,
            tokenCreator: userData[i].tokenCreator,
            tokenOwner: userData[i].tokenOwner,
            timestamp: userData[i].timestamp,
            name: userData[i].categoryid.name,
            id: userData[i]._id

          })
        }
        ////   //  console.log("("transaction", transaction)
        if (err) {
          return res
            .status(200)
            .json({ success: false, errors: { messages: "Error on server" } });
        }

        return res
          .status(200)
          .json({ success: true, userValue: transaction });
      });


  }

}
export const getItems = async (req, res) => {

  var currAddr = req.body.currAddr;

  User.findOne({ "curraddress": currAddr }).exec(function (err, userData) {
    if (err) {
      ////   //  console.log("(err);
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }

    return res
      .status(200)
      .json({ success: true, userValue: userData });

  })

}
export const getcatorylist = async (req, res) => {

  Token.find({ deleted: 1 }).populate('categoryid').exec(function (err, userData) {

    var transaction = [];
    for (var i = 0; i < userData.length; i++) {
      transaction.push({
        image: userData[i].image,
        tokenCounts: userData[i].tokenCounts,
        tokenName: userData[i].tokenName,
        tokenDesc: userData[i].tokenDesc,
        tokenPrice: userData[i].tokenPrice,
        tokenRoyality: userData[i].tokenRoyality,
        tokenBid: userData[i].tokenBid,
        tokenCreator: userData[i].tokenCreator,
        tokenOwner: userData[i].tokenOwner,
        timestamp: userData[i].timestamp,
        name: userData[i].categoryid.name,
        id: userData[i]._id

      })
    }
    if (err) {
      ////   //  console.log("(err);
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }

    return res
      .status(200)
      .json({ success: true, userValue: transaction, userData });
  });
}
export const getfaq = async (req, res) => {

  Faq.find({ deleted: 1 }, (err, userData) => {
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


export const profileupdate = async (req, res) => {
  try {
    var reqBody = req.body;

    let checkUser = await Admin.findOne({ "email": reqBody.email, "_id": { "$ne": req.user.id } });

    if (checkUser) {
      if (checkUser.email == reqBody.email) {
        return res.status(400).json({ "success": false, 'errors': { 'email': "Email already exists" } })
      }
    }

    let checkUser1 = await Admin.findOne({ "_id": req.user.id });

    //////   //  console.log("(checkUser);
    var test = await Admin.findOneAndUpdate(
      { _id: req.user.id },
      {
        name: req.body.name,
        email: req.body.email,
        phoneNo: req.body.mobilenumber,
        designation: req.body.designation,
        about: req.body.detail,
        company: req.body.company,
        profileImage: req.files.photo ? req.files.photo[0].filename : checkUser1.profileImage,
      }
    );
    return res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully" });
  } catch (err) {
    //////   //  console.log("("----err", err)
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
}

export const mailTemplate = async (identifier, email, contentData = {}) => {
  try {
    let emailTemplateData = await EmailTemplate.findOne({
      identifier: identifier,
    });
    if (!emailTemplateData) {
      return false;
    }

    let mailContent = {};
    mailContent["subject"] = emailTemplateData.subject;
    switch (identifier) {
      case "activate_register_user":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         * ##DATE## --> date
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_url##", contentData.confirmMailUrl)
          .replace("##DATE##", contentData.date);

        break;

      case "User_forgot":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_url##", contentData.confirmMailUrl);

        break;

      case "Withdraw_Confirmation":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_url##", contentData.confirmMailUrl);

        break;

      case "change_register_email":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_url##", contentData.confirmMailUrl);

        break;

      case "verify_new_email":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_url##", contentData.confirmMailUrl);

        break;

      case "Password_Changed":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)

        break;

      case "Level_Upgraded":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_level##", contentData.level)

        break;

      case "Deposit_Notification":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_deposit##", contentData.deposit)

        break;

      case "Welcome_User":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##message##", contentData.message);

        break;
    }
    // ////   //  console.log("("mailsent")
    sendEmail(email, mailContent);

    return true;
  } catch (err) {
    // ////   //  console.log("(err);
    return false;
  }
}


/**
 * Update 2FA Code
 * METHOD : PUT
 * URL : /api/security/2fa
 * BODY : code, secret, uri
 */
export const update2faCode = async (req, res) => {
  ////   //  console.log("(req.body)
  try {
    let reqBody = req.body;
    let check2Fa = node2fa.verifyToken(reqBody.secret, reqBody.code)
    ////   //  console.log("(check2Fa, "check2Facheck2Facheck2Facheck2Fa");
    if (check2Fa.delta == 0) {

      let ddata = await User.updateOne(
        { "_id": req.user.id },
        {
          "$push": {
            google2Fa: {
              "secret": reqBody.secret,
              "uri": reqBody.uri,
            }
          }
        }
      )
      ////   //  console.log("(ddata, "fdsfsdfsdfsfsd");

      return res.status(200).json({ 'success': true, 'messages': "Success" })
    }

    return res.status(400).json({ 'success': false, 'errors': { 'code': "Invalid Code" } })
  }
  catch (err) {
    ////   //  console.log("(err);
    return res.status(500).json({ "success": false, 'errors': { 'messages': "Error on server" } })
  }
}


/**
 * Get 2FA Code
 * METHOD : GET
 * URL : /api/security/2fa
 */
export const get2faCode = async (req, res) => {
  let result = {};
}

export const useraccept = async (req, res) => {
  if (req.body.id) {
    var ids = req.body.id;
    Tranaction.findOne({ "_id": ids }).exec(function (errr, response) {
      var userId = response.userId;
      var withdraw_amount = response.amount;
      ////   //  console.log("(withdraw_amount);
      if (response) {
        if (response.status != 0) {
          return res.status(200).json({ status: false, message: "You already submitted" });
        }
        if (response.status == 0) {
          Tranaction.findOneAndUpdate({ "_id": ids }, { "$set": { "status": 1 } }).exec(async function (er, resp) {
            if (resp) {
              ////   //  console.log("(userId, "userId===")


              var userBalance = await Tranaction.aggregate([
                { '$match': { "userId": userId } },
                {
                  "$facet": {
                    "withdraw": [
                      { '$match': { "withdrawDeposit": 2, "$or": [{ "status": 1 }, { "status": 2 }] } },
                      { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
                    ],
                    "deposit": [
                      { '$match': { "withdrawDeposit": 1, "status": 1 } },
                      { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
                    ],
                  }
                }
              ]);
              ////   //  console.log("(userBalance[0]);
              var withdrawUser = 0;
              if (userBalance[0].withdraw[0]) {
                var withdrawUser = userBalance[0].withdraw[0].amount;
              }

              var DeositUser = 0;
              if (userBalance[0].deposit[0]) {
                var DeositUser = userBalance[0].deposit[0].amount;
              }

              var userBalanceuser = parseFloat(DeositUser) - parseFloat(withdrawUser);

              ////   //  console.log("(withdrawUser, "withdrawUserwithdrawUserwithdrawUserwithdrawUserwithdrawUser");
              ////   //  console.log("(DeositUser, "DeositUserDeositUserDeositUserDeositUserDeositUserDeositUser")
              ////   //  console.log("(userBalanceuser, "userBalanceuseruserBalanceuseruserBalanceuseruserBalanceuser")

              //reduce user balance
              await User.findOneAndUpdate(
                { _id: ObjectId(userId) },
                {
                  $set: {
                    userBalance: parseFloat(userBalanceuser),
                  },
                },
                { new: true },
                function (selltemp_err, user) {
                  ////   //  console.log("(user, "user==");
                  return res.status(200).json({ status: true, message: "Your request submitted" });
                }
              );
            }
          })

        } else {
          res.redirect('/');
        }
      } else {
        res.redirect('/');
      }
    })
  }
}



export const updateWithdraw = async (req, res) => {
  try {
    let reqBody = req.body;
    //////   //  console.log("(reqBody, "reqBodyreqBodyreqBodyreqBodyreqBodyreqBody");
    let check2Fa = node2fa.verifyToken(reqBody.secret, reqBody.otp);
    //////   //  console.log("(check2Fa, "check2Facheck2Facheck2Fa");
    if (check2Fa == null) {
      return res
        .status(500)
        .json({ success: false, errors: { otp: "Ivalida code" } });
    }
    User.findOne(
      {
        _id: reqBody.id,
      },
      (err, userData) => {
        if (err) {
          ////   //  console.log("("----err0", err)
          return res
            .status(500)
            .json({ success: false, errors: { messages: "Error on server" } });
        }
        if (!userData) {
          ////   //  console.log("("----err1", err)
          return res
            .status(400)
            .json({ success: false, errors: { email: "User is not exists" } });
        }
        Settings.findOne({},
          (err, sett) => {

            if (userData.userBalance < (parseFloat(reqBody.amount) + parseFloat(sett.fees)) || (parseFloat(reqBody.amount) + parseFloat(sett.fees)) < 0) {
              return res
                .status(500)
                .json({ success: false, errors: { error: "User balance is low" } });
            }

            var data = new Tranaction({
              "userId": reqBody.id,
              "fromaddress": userData.addressbtc,
              "toaddress": reqBody.address,
              "fromuserId": reqBody.id,
              "name": userData.name,
              "amount": parseFloat(reqBody.amount),
              "adminfees": parseFloat(sett.fees),
              "savid": userData.userid,
              "transactionType": "Withdraw",
              "withdrawDeposit": 2,
              "currency": "Sovranoseeds",
              "status": 0,
            });

            data.save(function (err, rest) {
              let content = {
                name: userData.name,
                confirmMailUrl: `${config.siteUrl}/accept/${rest._id}`,
              };
              //////   //  console.log("("User_forgot", userData.email, content);
              mailTemplate("Withdraw_Confirmation", userData.email, content);

              let content1 = {
                name: "Dear Admin Request from  user" + userData.name + "for withdraw amount" + parseFloat(reqBody.amount),
                confirmMailUrl: `${config.siteUrl}/accept/${rest._id}`,
              };

              let checkAdminUser = Admin.findOne();
              mailTemplate("Withdraw_Confirmation", checkAdminUser.email, content1)

              return res.status(200).json({ success: true });
            });
          });
      }

    );
  } catch (err) {
    ////   //  console.log("("----err2", err)
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
}


export const purchasePlan = async (req, res) => {
  User.findOne({ _id: req.user.id }, {}).then(async (userdata) => {
    Settings.findOne({}, {}).then(async (feesdata) => {
      req.body.amount = parseFloat(req.body.amount) + parseFloat(feesdata.feesPlan);
      req.body.fees = feesdata.feesPlan;
      if (req.body.amount > userdata.userBalance) {
        ////   //  console.log("("saran12345")
        return res.status(200).json({ success: false, message: "Insufficient Balance" });
      } else {
        ////   //  console.log("(req.body, "came Inside")
        if (req.body.plan == 1) {
          var reposnse = await registerUser(req.user.id, userdata.refid, req.body);
          return res.status(200).json({ success: true, message: "Plan purchased" });
        } else {
          if (req.body.matrix == 3) {
            var reposnse = await buynewLevel3(req.user.id, userdata.refid, req.body);
            return res.status(200).json({ success: true, message: "Plan purchased" });
          } else if (req.body.matrix == 6) {
            // ////   //  console.log("(userdata.refid,"userdata.refid===");
            var reposnse = await buynewLevel6(req.user.id, userdata.refid, req.body);
            return res.status(200).json({ success: true, message: "Plan purchased" });
          }
        }
      }
    });
  });
};

function buynewLevel3(currentUserId, _referrerId, data) {
  UserDetails.aggregate([
    { "$unwind": "$userDet" },
    {
      "$facet": {
        "mat": [
          { '$match': { "userDet.level": data.plan, "userDet.matrix": data.matrix, "userDet.id": ObjectId(currentUserId) } }
        ]
      }
    }
  ]).then(async (userdata) => {
    if (userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet._id) {
      ////   //  console.log("("You already Purchased")
    } else {
      UserDetails.aggregate([
        { "$unwind": "$userDet" },
        {
          "$facet": {
            "mat": [
              { '$match': { "userDet.level": data.plan, "userDet.matrix": data.matrix, "userDet.id": ObjectId(_referrerId) } }
            ],
            "all": [
              { '$match': { "userID": "1" } }
            ]
          }
        }
      ]).then(async (userdata) => {
        ////   //  console.log("("saran1");
        ////   //  console.log("(userdata);
        if (userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0] && userdata[0].all && userdata[0].all[0] && userdata[0].all[0].userDet && userdata[0].mat[0].userDet._id) {
          var user = userdata[0].mat[0].userDet;
          var all = userdata[0].all[0].userDet;

          if (user.rebirthSlot < 2) {
            ////   //  console.log("("saran2");
            var rebirthSlot = parseInt(user.rebirthSlot) + parseInt(1);
            var condition = { "userDet._id": ObjectId(user._id) };
            var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
            ////   //  console.log("(currentUserId, _referrerId, data, updateplandet, condition, "upgrade")
            await payforSignup(currentUserId, _referrerId, data, updateplandet, condition, "upgrade");
          }
          else {
            ////   //  console.log("("saran3");
            var rebirthSlot = 0;
            var rebirthcount = parseInt(user.rebirthcount) + parseInt(1);
            var condition = { "userDet._id": ObjectId(user._id) };
            var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot, "userDet.$.rebirthcount": rebirthcount } };
            var parentId = user.parentAdd;
            if (typeof parentId == "undefined") {
              var parentId = all.id;
            }
            ////   //  console.log("("saran5");
            ////   //  console.log("(currentUserId, parentId, data, updateplandet, condition, "upgrade");
            await findparentpayment(currentUserId, parentId, data, updateplandet, condition, "upgrade");
          }

        } else {
          ////   //  console.log("("saran4");
          await findnextlevel(currentUserId, _referrerId, data);
        }

      })

    }
  });
}

function findnextlevel(currentUserId, _referrerId, data, updateplandet, condition, upg) {
  ////   //  console.log("(_referrerId, "_referrerId");
  UserDetails.aggregate([
    { "$unwind": "$userDet" },
    {
      "$facet": {
        "mat": [
          { '$match': { "userDet.id": ObjectId(_referrerId) } }
        ]
      }
    }
  ]).then(async (userdata) => {
    if (userdata && userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet.parentAdd) {
      //////   //  console.log("(curpayid);
      var curpayid = userdata[0].mat[0].userDet.parentAdd
      if (curpayid != "") {
        ////   //  console.log("(curpayid);
        UserDetails.aggregate([
          { "$unwind": "$userDet" },
          {
            "$facet": {
              "mat": [
                { '$match': { "userDet.level": data.plan, "userDet.matrix": data.matrix, "userDet.id": ObjectId(curpayid) } }
              ],
              "all": [
                { '$match': { "userID": "1" } }
              ]
            }
          }
        ]).then(async (userdata) => {
          if (userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet._id) {
            var user = userdata[0].mat[0].userDet;
            var all = userdata[0].all[0].userDet;

            if (user.rebirthSlot < 2) {
              var rebirthSlot = parseInt(user.rebirthSlot) + parseInt(1);
              var condition = { "userDet._id": ObjectId(user._id) };
              var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
              await payforSignup(currentUserId, curpayid, data, updateplandet, condition, "upgrade");
            }
            else {
              var rebirthSlot = 0;
              var rebirthcount = parseInt(user.rebirthcount) + parseInt(1);
              var condition = { "userDet._id": ObjectId(user._id) };
              var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot, "userDet.$.rebirthcount": rebirthcount } };
              var parentId = user.parentAdd;
              if (typeof parentId == "undefined") {
                var parentId = all.id;
              }
              await findparentpayment(currentUserId, parentId, data, updateplandet, condition, "upgrade");
            }
          }
          else {
            await findnextlevel(currentUserId, curpayid, data, updateplandet, condition, upg)
          }
        }
        )
      } else {
        UserDetails.findOne({}).then(async (userdata) => {
          ////   //  console.log("(userdata, "Admin--------------");
          var user = userdata.userDet[0];

          await payforSignup(currentUserId, user.id, data, updateplandet, condition, "upgrade");
        })
      }
    }


  })
}

function findnext6level(currentUserId, _referrerId, data, updateplandet, condition, upg) {
  ////   //  console.log("(_referrerId, "_referrerId");
  UserDetails.aggregate([
    { "$unwind": "$userDet" },
    {
      "$facet": {
        "mat": [
          { '$match': { "userDet.id": ObjectId(_referrerId) } }
        ]
      }
    }
  ]).then(async (userdata) => {
    if (userdata && userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet.parentAdd) {
      //////   //  console.log("(curpayid);
      var curpayid = userdata[0].mat[0].userDet.parentAdd
      if (curpayid != "") {
        ////   //  console.log("(curpayid);
        UserDetails.aggregate([
          { "$unwind": "$userDet" },
          {
            "$facet": {
              "mat": [
                { '$match': { "userDet.level": data.plan, "userDet.matrix": data.matrix, "userDet.id": ObjectId(curpayid) } }
              ],
              "all": [
                { '$match': { "userID": "1" } }
              ]
            }
          }
        ]).then(async (userdata) => {

          if (userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet._id) {
            var user = userdata[0].mat[0].userDet;
            var all = userdata[0].all[0].userDet;

            if (userdata && userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet._id) {
              ////   //  console.log("("saran0000", user.rebirthSlot);
              var user = userdata[0].mat[0].userDet;
              var all = userdata[0].all[0].userDet;
              var rebirthSlot = parseInt(user.rebirthSlot) + parseInt(1);
              if (user.rebirthSlot > 1 && user.rebirthSlot < 5) {
                ////   //  console.log("("saran0");
                var rebirthSlot = parseInt(user.rebirthSlot) + parseInt(1);
                var condition = { "userDet._id": ObjectId(user._id) };
                var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
                ////   //  console.log("(currentUserId, _referrerId, data, updateplandet, condition, "upgrade");
                await payforSignup(currentUserId, curpayid, data, updateplandet, condition, "upgrade");
              } else if (user.rebirthSlot < 2) {
                ////   //  console.log("("saran3");
                var rebirthSlot = parseInt(user.rebirthSlot) + parseInt(1);
                var condition = { "userDet._id": ObjectId(user._id) };
                var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
                var parentId = user.parentAdd;
                if (typeof parentId == "undefined") {
                  var parentId = all.id;
                }
                ////   //  console.log("(currentUserId, parentId, data, updateplandet, condition, "upgrade");
                await findparentpayment(currentUserId, parentId, data, updateplandet, condition, "upgrade");
              } else if (user.rebirthSlot > 4) {
                ////   //  console.log("("saran4");
                var rebirthSlot = 0;
                var rebirthcount = parseInt(user.rebirthcount) + parseInt(1);
                var condition = { "userDet._id": ObjectId(user._id) };
                var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot, "userDet.$.rebirthcount": rebirthcount } };
                var parentId = user.parentAdd;
                if (typeof parentId == "undefined") {
                  var parentId = all.id;
                }
                await findparentpayment(currentUserId, parentId, data, updateplandet, condition, "upgrade")
              }
            }

          }
          else {
            await findnext6level(currentUserId, curpayid, data, updateplandet, condition, upg)
          }
        }
        )
      } else {
        UserDetails.findOne({}).then(async (userdata) => {
          ////   //  console.log("(userdata, "Admin--------------");
          var user = userdata.userDet[0];

          await payforSignup(currentUserId, user.id, data, updateplandet, condition, "upgrade");
        })
      }
    }


  })
}

function buynewLevel6(currentUserId, _referrerId, data) {
  ////   //  console.log("(_referrerId, "_referrerId==========");
  UserDetails.aggregate([
    { "$unwind": "$userDet" },
    {
      "$facet": {
        "mat": [
          { '$match': { "userDet.level": data.plan, "userDet.matrix": data.matrix, "userDet.id": ObjectId(currentUserId) } }
        ]
      }
    }
  ]).then(async (userdata) => {
    //////   //  console.log("(userdata, "saran");
    if (userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet._id) {
      ////   //  console.log("("You already Purchased")
    } else {
      ////   //  console.log("("saran1");
      UserDetails.aggregate([
        { "$unwind": "$userDet" },
        {
          "$facet": {
            "mat": [
              { '$match': { "userDet.level": data.plan, "userDet.matrix": data.matrix, "userDet.id": ObjectId(_referrerId) } }
            ],
            "all": [
              { '$match': { "userID": "1" } }
            ]
          }
        }
      ]).then(async (userdata) => {
        ////   //  console.log("("saran2");
        if (userdata && userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet._id) {

          var user = userdata[0].mat[0].userDet;
          var all = userdata[0].all[0].userDet;
          //////   //  console.log("("saran0000",user.rebirthSlot);
          if (user.rebirthSlot > 1 && user.rebirthSlot < 5) {
            ////   //  console.log("("saran0");
            var rebirthSlot = parseInt(user.rebirthSlot) + parseInt(1);
            var condition = { "userDet._id": ObjectId(user._id) };
            var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
            await payforSignup(currentUserId, _referrerId, data, updateplandet, condition, "upgrade");
          } else if (user.rebirthSlot < 2) {
            ////   //  console.log("("saran333333");
            var rebirthSlot = parseInt(user.rebirthSlot) + parseInt(1);
            var condition = { "userDet._id": ObjectId(user._id) };
            var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
            var parentId = user.parentAdd;
            if (typeof parentId == "undefined") {
              var parentId = all.id;
            }
            ////   //  console.log("(currentUserId, parentId, data, updateplandet, condition, "upgrade")
            await findparentpayment(currentUserId, parentId, data, updateplandet, condition, "upgrade");
          } else if (user.rebirthSlot > 4) {
            ////   //  console.log("("saran4");
            var rebirthSlot = 0;
            var rebirthcount = parseInt(user.rebirthcount) + parseInt(1);
            var condition = { "userDet._id": ObjectId(user._id) };
            var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot, "userDet.$.rebirthcount": rebirthcount } };
            var parentId = user.parentAdd;
            if (typeof parentId == "undefined") {
              var parentId = all.id;
            }
            await findparentpayment(currentUserId, parentId, data, updateplandet, condition, "upgrade")
          }
        } else {
          findnext6level(currentUserId, _referrerId, data)
        }
      })
    }
  })
}

function findparentpayment(currentUserId, parentId, data, updateplandet, condition, RegOrUp) {
  if (parentId != "") {
    UserDetails.aggregate([
      { "$unwind": "$userDet" },
      {
        "$facet": {
          "mat": [
            { '$match': { "userDet.level": data.plan, "userDet.matrix": data.matrix, "userDet.id": ObjectId(parentId) } }
          ]
        }
      }
    ]).then(async (userdata) => {
      ////   //  console.log("(userdata, 'userdata=====');

      if (userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet._id) {
        var user = userdata[0].mat[0].userDet;
        ////   //  console.log("(user, "user");
        ////   //  console.log("(currentUserId, parentId, data, updateplandet, condition, "upgrade");
        await payforSignup(currentUserId, parentId, data, updateplandet, condition, "upgrade");
      } else {

        UserDetails.aggregate([
          { "$unwind": "$userDet" },
          {
            "$facet": {
              "mat": [
                { '$match': { "userDet.id": ObjectId(parentId) } }
              ]
            }
          }
        ]).then(async (userdatares) => {
          ////   //  console.log("(userdatares, "parentId=====Raj1")
          if (userdatares && userdatares[0] && userdatares[0].mat && userdatares[0].mat[0] && userdatares[0].mat[0].userDet._id != null) {
            ////   //  console.log("(userdatares[0].mat[0].userDet.parentAdd);
            await findparentpayment(currentUserId, userdatares[0].mat[0].userDet.parentAdd, data, updateplandet, condition, RegOrUp);
          } else {
            ////   //  console.log("(parentId, "parentId=====Raj")
            await payforSignup(currentUserId, parentId, data, updateplandet, condition, RegOrUp);
          }


        });


      }
    });
  } else {
    UserDetails.aggregate([
      { "$unwind": "$userDet" },
      {
        "$facet": {
          "mat": [
            { '$match': { "userID": "1" } }
          ]
        }
      }
    ]).then(async (userdata) => {
      if (userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet._id && userdata[0].all && userdata[0].all[0] && userdata[0].all[0].userDet && userdata[0].all[0].userDet._id) {
        var user = userdata[0].mat[0].userDet;
        await payforSignup(currentUserId, user.id, data, updateplandet, condition, "upgrade");
      }
    })
  }
}

// async function registerSixmatrixpayment(currentUserId, _referrerId, data, users6, all) {
//   if (users6) {
//     data.matrix = 6;
//     if (users6.rebirthSlot > 0 && users6.rebirthSlot < 5 && users6.rebirthSlot != 3) {
//       var rebirthSlot = parseInt(users6.rebirthSlot) + parseInt(1);
//       var condition = { "userDet._id": ObjectId(users6._id) };
//       var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
//       // ////   //  console.log("(_referrerId,"_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerIdsaran")
//       await payforSignup1(currentUserId, _referrerId, data, updateplandet, condition, "register");
//     } else if (users6.rebirthSlot == 3 || users6.rebirthSlot == 0) {
//       var rebirthSlot = parseInt(users6.rebirthSlot) + parseInt(1);
//       var condition = { "userDet._id": ObjectId(users6._id) };
//       var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
//       var parentId = users6.parentId;
//       if (typeof parentId == "undefined") {
//         var parentId = all.id;
//       }
//       await payforSignup1(currentUserId, parentId, data, updateplandet, condition, "register");
//     } else if (users6.rebirthSlot > 4) {
//       var rebirthSlot = 0;
//       var rebirthcount = parseInt(users6.rebirthcount) + parseInt(1);
//       var condition = { "userDet._id": ObjectId(users6._id) };
//       var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot, "userDet.$.rebirthcount": rebirthcount } };
//       var parentId = users6.parentId;
//       if (typeof parentId == "undefined") {
//         var parentId = all.id;
//       }
//       await payforSignup1(currentUserId, users6.parentAdd, data, updateplandet, condition, "register");
//     }
//   }
// }

function registerUser(currentUserId, _referrerId, data) {
  ////   //  console.log("("sadasdsadsa");
  UserDetails.aggregate([
    { "$unwind": "$userDet" },
    {
      "$facet": {
        "mat3": [
          { '$match': { "userDet.level": 1, "userDet.matrix": 3, "userDet.id": ObjectId(_referrerId) } }
        ],
        "mat6": [
          { '$match': { "userDet.level": 1, "userDet.matrix": 6, "userDet.id": ObjectId(_referrerId) } }
        ],
        "all": [
          { '$match': { "userID": "1" } }
        ]
      }
    }
  ]).then(async (userdata) => {
    ////   //  console.log("(userdata, "++++++++++++++++++++++++++++");
    if (userdata[0] && userdata[0].mat3 && userdata[0].mat3[0] && userdata[0].mat3[0].userDet && userdata[0].mat3[0].userDet._id) {
      var users3 = userdata[0].mat3[0].userDet;
      var all = userdata[0].all[0].userDet;
      //////   //  console.log("(users3.rebirthSlot);
      if (users3.rebirthSlot < 2) {
        ////   //  console.log("("thiruurieuiu");
        var rebirthSlot = parseInt(users3.rebirthSlot) + parseInt(1);
        var condition = { "userDet._id": ObjectId(users3._id) };
        var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
        data.matrix = 3;
        await payforSignup(currentUserId, _referrerId, data, updateplandet, condition, "register");
      } else {
        ////   //  console.log("("fdfdsfdsfds")
        var rebirthSlot = 0;
        var rebirthcount = parseInt(users3.rebirthcount) + parseInt(1);
        var condition = { "userDet._id": ObjectId(users3._id) };
        data.matrix = 3;
        var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot, "userDet.$.rebirthcount": rebirthcount } };
        var parentId = users3.parentAdd;
        if (typeof parentId == "undefined") {
          var parentId = all.id;
        }
        await payforSignup(currentUserId, parentId, data, updateplandet, condition, "register");

      }
    }

    if (userdata[0] && userdata[0].mat6 && userdata[0].mat6[0] && userdata[0].mat6[0].userDet && userdata[0].mat6[0].userDet._id) {
      //////   //  console.log("("fdfdsfdsfds")
      var users6 = userdata[0].mat6[0].userDet;
      var all = userdata[0].all[0].userDet;
      data.matrix = 6;
      if (users6.rebirthSlot > 1 && users6.rebirthSlot < 5) {
        // onsole.log("fdfdsfdsfds2")
        var rebirthSlot = parseInt(users6.rebirthSlot) + parseInt(1);
        var condition = { "userDet._id": ObjectId(users6._id) };
        var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
        ////   //  console.log("(_referrerId, "_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerIdsaran")
        await payforSignup(currentUserId, _referrerId, data, updateplandet, condition, "register");
      } else if (users6.rebirthSlot < 2) {
        ////   //  console.log("("fdfdsfdsfds2")
        var rebirthSlot = parseInt(users6.rebirthSlot) + parseInt(1);
        var condition = { "userDet._id": ObjectId(users6._id) };
        var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot } };
        var parentId = users6.parentAdd;
        if (typeof parentId == "undefined") {
          var parentId = all.id;
        }
        //////   //  console.log("(parentId,"_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerIdsaran")
        await payforSignup(currentUserId, parentId, data, updateplandet, condition, "register");
      } else if (users6.rebirthSlot > 4) {
        // ////   //  console.log("("fdfdsfdsfds3")
        var rebirthSlot = 0;
        var rebirthcount = parseInt(users6.rebirthcount) + parseInt(1);
        var condition = { "userDet._id": ObjectId(users6._id) };
        var updateplandet = { $set: { "userDet.$.rebirthSlot": rebirthSlot, "userDet.$.rebirthcount": rebirthcount } };
        var parentId = users6.parentAdd;
        if (typeof parentId == "undefined") {
          var parentId = all.id;
        }
        ////   //  console.log("(_referrerId, "_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerId_referrerIdsaran")
        await payforSignup(currentUserId, parentId, data, updateplandet, condition, "register");
      }
    }
  });
}


async function payforSignup(currentUserId, _referrerId, data, updateplandet, condition, RegOrUp) {
  let currentuseruserdata = await User.findOne({ _id: currentUserId }, {});
  let refrerdata = await User.findOne({ _id: _referrerId }, {});


  let planupdate = await UserDetails.aggregate([
    { "$unwind": "$userDet" },
    {
      "$facet": {
        "mat": [
          { '$match': { "userDet._id": ObjectId(condition['userDet._id']) } }
        ],
      }
    }
  ]).then(async (userdata) => {
    //////   //  console.log("(userdata[0].mat[0], "saran");
    if (userdata[0] && userdata[0].mat && userdata[0].mat[0] && userdata[0].mat[0].userDet && userdata[0].mat[0].userDet._id) {
      var planupdate = userdata[0].mat[0].userDet;
      ////   //  console.log("(planupdate, "bala subbu");
      var rebisrtslot = new rebirthSlot({
        userID: planupdate.id,
        rebirthSlot: planupdate.rebirthSlot,
        rebirthCount: planupdate.rebirthcount,
        childId: currentUserId,
        matrix: planupdate.matrix,
        level: planupdate.level,
      });
      ////   //  console.log("(data.matrix);
      ////   //  console.log("(updateplandet['$set']['userDet.$.rebirthSlot']);
      var rebisrtSlotdet = await rebisrtslot.save();

      if (data.matrix == 6 && updateplandet['$set']['userDet.$.rebirthSlot'] == 0) {
        let getrandom = await rebirthSlot.find(
          {
            userID: ObjectId(planupdate.id),
            rebirthCount: parseInt(updateplandet['$set']['userDet.$.rebirthcount']) - 1,
            userID: planupdate.id,
            matrix: planupdate.matrix,
            level: planupdate.level
          },
          {});
        if (getrandom.length > 0) {
          ////   //  console.log("(getrandom, "getrandomgetrandomgetrandomgetrandom");
          const random = Math.floor(Math.random() * getrandom.length);
          ////   //  console.log("(random, getrandom[random], "getrandomgetrandomgetrandomgetrandom");

          _referrerId = getrandom[random].childId
          ////   //  console.log("(_referrerId, "childidchildidchildidchildidchildid");
        }
      }
    }
  })

  var depositdata = new Tranaction({
    userId: currentUserId,
    fromuserId: currentUserId,
    touserId: _referrerId,
    name: currentuseruserdata.name,
    savid: currentuseruserdata.userid,
    amount: parseFloat(data.amount),
    matrix: data.matrix,
    adminfees: parseFloat(data.fees),
    level: data.plan,
    transactionType: "Purchase",
    transactionId: "Purchase",
    withdrawDeposit: 2,
    currency: "Sovranoseeds",
    status: 2,
  });

  var depositdoc = await depositdata.save();

  var depositdata = new Tranaction({
    userId: _referrerId,
    fromuserId: currentUserId,
    touserId: _referrerId,
    name: refrerdata.name,
    savid: refrerdata.userid,
    amount: (parseFloat(data.amount) - parseFloat(data.fees)),
    transactionType: "Referal",
    transactionId: "Referal",
    withdrawDeposit: 1,
    currency: "Sovranoseeds",
    currencyType: 1,
    status: 1,
    level: data.plan,
    matrix: data.matrix,
    reffrom: currentuseruserdata.userid
  });

  var depositdoc = await depositdata.save();

  var userBalance = await Tranaction.aggregate([
    { '$match': { "userId": currentUserId } },
    {
      "$facet": {
        "withdraw": [
          { '$match': { "withdrawDeposit": 2, "$or": [{ "status": 1 }, { "status": 2 }] } },
          { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
        ],
        "deposit": [
          { '$match': { "withdrawDeposit": 1, "status": 1 } },
          { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
        ],
      }
    }
  ]);

  var withdrawUser = 0;
  if (userBalance[0].withdraw[0]) {
    var withdrawUser = userBalance[0].withdraw[0].amount;
  }

  var DeositUser = 0;
  if (userBalance[0].deposit[0]) {
    var DeositUser = userBalance[0].deposit[0].amount;
  }

  var userBalanceuser = parseFloat(DeositUser) - parseFloat(withdrawUser);

  await User.findOneAndUpdate(
    { _id: currentUserId },
    {
      $set: {
        plan: data.plan,
        userBalance: parseFloat(userBalanceuser),
      },
    }
  );

  var userBalance = await Tranaction.aggregate([
    { '$match': { "userId": _referrerId } },
    {
      "$facet": {
        "withdraw": [
          { '$match': { "withdrawDeposit": 2, "$or": [{ "status": 1 }, { "status": 2 }] } },
          { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
        ],
        "deposit": [
          { '$match': { "withdrawDeposit": 1, "status": 1 } },
          { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
        ],
      }
    }
  ]);
  ////   //  console.log("(userBalance[0]);
  var withdrawUser = 0;
  if (userBalance[0].withdraw[0]) {
    var withdrawUser = userBalance[0].withdraw[0].amount;
  }

  var DeositUser = 0;
  if (userBalance[0].deposit[0]) {
    var DeositUser = userBalance[0].deposit[0].amount;
  }

  var userBalanceuser = parseFloat(DeositUser) - parseFloat(withdrawUser);
  ////   //  console.log("(withdrawUser, "withdrawUserwithdrawUserwithdrawUserwithdrawUserwithdrawUser");
  ////   //  console.log("(DeositUser, "DeositUserDeositUserDeositUserDeositUserDeositUserDeositUser")
  ////   //  console.log("(userBalanceuser, "userBalanceuseruserBalanceuseruserBalanceuseruserBalanceuser")
  await User.findOneAndUpdate(
    { _id: _referrerId },
    {
      $set: {
        plan: data.plan,
        userBalance: parseFloat(userBalanceuser),
      },
    }
  );

  ////   //  console.log("(data.matrix, "data.matrix--------------------------------------")



  if (RegOrUp == "register") {
    if (data.matrix == 3) {
      ////   //  console.log("(data.matrix, "333333data.matrix--------------------------------------")
      var userDetail = {};
      userDetail.rebirthcount = 0;
      userDetail.rebirthSlot = 0;
      userDetail.id = currentUserId;
      userDetail.parentAdd = currentuseruserdata.refid;
      userDetail.level = data.plan;
      userDetail.matrix = 3;
      await UserDetails.findOneAndUpdate(
        { userID: 1 },
        {
          $push: { userDet: userDetail },
        },
        { new: true });
    } else {
      ////   //  console.log("(data.matrix, "66666data.matrix--------------------------------------")
      var userDetail = {};
      userDetail.rebirthcount = 0;
      userDetail.rebirthSlot = 0;
      userDetail.id = currentUserId;
      userDetail.parentAdd = currentuseruserdata.refid;
      userDetail.level = data.plan;
      userDetail.matrix = 6;
      await UserDetails.findOneAndUpdate(
        { userID: 1 },
        {
          $push: { userDet: userDetail },
        },
        { new: true })
    }
  } else {
    var userDetail = {};
    userDetail.rebirthcount = 0;
    userDetail.rebirthSlot = 0;
    userDetail.id = currentUserId;
    userDetail.parentAdd = currentuseruserdata.refid;
    userDetail.level = data.plan;
    userDetail.matrix = data.matrix;
    await UserDetails.findOneAndUpdate(
      { userID: 1 },
      {
        $push: { userDet: userDetail },
      },
      { new: true });
  }

  await UserDetails.findOneAndUpdate(
    condition,
    updateplandet,
    { multi: true, fields: { userDet: 1 } });

  return;
}

async function movetoAdmin(amount) {
}



// /added
export const getExplore = async (req, res) => {

  var reqBody = req.params._id;
  ////   //  console.log("("View Token" + reqBody)
  ////   //  console.log("("id get : " + new mongoose.Types.ObjectId(reqBody))
  Category.findOne({ "_id": new mongoose.Types.ObjectId(reqBody) }, (err, data) => {
    Token.find({ "categoryid": new mongoose.Types.ObjectId(reqBody) })
      .then((data) => {
        res.json({ success: true, message: "Pair Updated Successfully", data });
      })
      .catch((e) => {
        res.json({ success: true, message: "failed", e });
      })
  })

}



///////
export const editprofile = async (req, res) => {
  var reqBody = req.body;
  var files = req.files;
  let updateData = await User.findOne({ "curraddress": reqBody.currAddr });
  if (updateData) {  //already inserted data
    if (files != null) {
      var test = await User.findOneAndUpdate(
        { _id: updateData._id },
        {
          name: reqBody.name,
          email: reqBody.email,
          personalsite: reqBody.personalsite,
          customurl: reqBody.customurl,
          bio: reqBody.bio,
          twitter: reqBody.twitter,
          facebook: reqBody.facebook,
          youtube: reqBody.youtube,
          instagram: reqBody.instagram,
          description: reqBody.description,
          curraddress: reqBody.currAddr,
          image: files.photo.name
        }
      );
      fs.mkdir('public/images/' + test._id, { recursive: true }, function (err) {
        if (err) return ////   //  console.log("('cannot create public/product_images/ directory');
        ////   //  console.log("('public/product_images/ directory created');
      });
      //resized image
      fs.mkdir('public/images/user/' + test._id, { recursive: true }, function (err) {
        if (err) return ////   //  console.log("('cannot create public/product_images/ directory');
        ////   //  console.log("('public/product_images/resizeImg directory created');
      });

      var productImage = req.files.photo;
      var path = 'public/images/' + test._id + '/' + productImage.name;
      var thumbsPath = 'public/images/user/' + test.tokenCreator + '/' + productImage.name;

      productImage.mv(path, function (err) {
        // if (err)
        //  console.log(err);
      });

      return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", test })




    } else {

      var test = await User.findOneAndUpdate(
        { _id: updateData._id },
        {
          name: reqBody.name,
          email: reqBody.email,
          personalsite: reqBody.personalsite,
          customurl: reqBody.customurl,
          bio: reqBody.bio,
          twitter: reqBody.twitter,
          facebook: reqBody.facebook,
          youtube: reqBody.youtube,
          instagram: reqBody.instagram,
          //description:reqBody.description,
          curraddress: reqBody.currAddr,
          image: updateData.image
        }
      );
      return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", test })

    }

  } else { /// new record inserted

    if (files != null) {
      var user = new User({
        "name": reqBody.name,
        "email": reqBody.email,
        "personalsite": reqBody.personalsite,
        "customurl": reqBody.customurl,
        "bio": reqBody.bio,
        "twitter": reqBody.twitter,
        "facebook": reqBody.facebook,
        "youtube": reqBody.youtube,
        "instagram": reqBody.instagram,
        // "description":reqBody.description,
        "curraddress": reqBody.currAddr,
        "image": files.photo.name
      })
      user.save(function (err, result) {
        if (err) {
          res
            .status(500)
            .json({ success: false, errors: { messages: "Error on server" } });
        }
        fs.mkdir('public/images/' + user._id, { recursive: true }, function (err) {
          if (err) return ////   //  console.log("('cannot create public/product_images/ directory');
        });
        fs.mkdir('public/images/user/' + user._id, { recursive: true }, function (err) {
          if (err) return ////   //  console.log("('cannot create public/product_images/ directory');
        });

        var productImage = req.files.photo;
        var path = 'public/images/' + user._id + '/' + productImage.name;
        var thumbsPath = 'public/images/' + user._id + '/resizeImg/' + '/' + productImage.name;

        productImage.mv(path, function (err) {
          // if (err)
          //   //  console.log("(err);
        });

        return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", result })
      })
    } else {
      var user = new User({
        "name": reqBody.name,
        "email": reqBody.email,
        "personalsite": reqBody.personalsite,
        "customurl": reqBody.customurl,
        "bio": reqBody.bio,
        "twitter": reqBody.twitter,
        "facebook": reqBody.facebook,
        "youtube": reqBody.youtube,
        "instagram": reqBody.instagram,
        "description": reqBody.description,
        "curraddress": reqBody.currAddr,
      })
      user.save(function (err, result) {
        if (err) {
          //   //   //  console.log("("rrrrrrrrrr", error)
          res
            .status(500)
            .json({ success: false, errors: { messages: "Error on server" } });
        }

        return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", result })
      })
    }
  }
}

export const coverImage = async (req, res) => {
  var files = req.files;
  ////   //  console.log("("files", files)
  var reqBody = req.body;
  let updateData = await User.findOne({ "curraddress": reqBody.accounts });
  if (updateData) {
    if (files != null) {

      var test = await User.findOneAndUpdate(
        { _id: updateData._id },
        {
          curraddress: reqBody.accounts,
          coverimage: files.coverimage.name
        }
      );
      fs.mkdir('public/images/' + test._id, { recursive: true }, function (err) {
        if (err) return ////   //  console.log("('cannot create public/product_images/ directory');
        ////   //  console.log("('public/product_images/ directory created');
      });
      //resized image
      fs.mkdir('public/images/user/' + test._id, { recursive: true }, function (err) {
        if (err) return ////   //  console.log("('cannot create public/product_images/ directory');
        ////   //  console.log("('public/product_images/resizeImg directory created');
      });

      var productImage = req.files.coverimage;
      var path = 'public/images/' + test._id + '/' + productImage.name;
      var thumbsPath = 'public/images/user/' + test._id + '/' + productImage.name;

      productImage.mv(path, function (err) {
        // if (err)
        //   //  console.log("(err);
      });

      return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", test })

    }

  } else {
    if (files != null) {
      var user = new User({
        "curraddress": reqBody.accounts,
        "coverimage": files.coverimage.name
      })
      user.save(function (err, result) {
        if (err) {
          res
            .status(500)
            .json({ success: false, errors: { messages: "Error on server" } });
        }
        fs.mkdir('public/images/' + user._id, { recursive: true }, function (err) {
          if (err) return //   //  console.log("('cannot create public/product_images/ directory');
        });
        fs.mkdir('public/images/user/' + user._id, { recursive: true }, function (err) {
          if (err) return //   //  console.log("('cannot create public/product_images/ directory');
        });

        var productImage = req.files.coverImage;
        var path = 'public/images/' + user._id + '/' + productImage.coverimage;


        productImage.mv(path, function (err) {
          // if (err)
          //   //  console.log("(err);
        });
        return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", result })
      })

    }

  }

}
export const createdData = async (req, res) => {
  var reqBody = req.body;
  var retJsonObj = {};
  retJsonObj.list = {};
  retJsonObj.list.transaction = [];
  retJsonObj.list.count = [];

  let CountData = await Token.find({ "tokenOwner": reqBody.currAddr, "deleted": 1 }).count();
  retJsonObj.list.count.push({
    count: CountData
  })
  Token.find({ "tokenOwner": reqBody.currAddr, "deleted": 1 })
    .populate('categoryid')
    .exec(function (err, userData) {
      var transaction = [];

      for (var i = 0; i < userData.length; i++) {
        retJsonObj.list.transaction.push({
          image: userData[i].image,
          tokenCounts: userData[i].tokenCounts,
          tokenName: userData[i].tokenName,
          tokenDesc: userData[i].tokenDesc,
          tokenPrice: userData[i].tokenPrice,
          tokenRoyality: userData[i].tokenRoyality,
          tokenBid: userData[i].tokenBid,
          tokenCreator: userData[i].tokenCreator,
          tokenOwner: userData[i].tokenOwner,
          timestamp: userData[i].timestamp,
          // check
          tokenCategory: userData[i].categoryid.name,
          id: userData[i]._id,
          status: userData[i].status,
          hashValue: userData[i].hashValue,
          balance: userData[i].balance,
          tokenQuantity: userData[i].tokenQuantity
        })
      }
      return res.status(200).json({ 'success': true, 'message': "Colections data", retJsonObj })
    })

}
export const collectiblesData = async (req, res) => {
  var reqBody = req.body;
  var retJsonObj = {};
  retJsonObj.list = {};
  retJsonObj.list.transaction = [];
  retJsonObj.list.count = [];

  let CountData = await Token.find({ "tokenOwner": reqBody.currAddr, "tokenPrice": 0, "tokenBid": false, "deleted": 1 }).count();
  retJsonObj.list.count.push({
    count: CountData
  })
  Token.find({ "tokenOwner": reqBody.currAddr, "tokenPrice": 0, "tokenBid": false, "deleted": 1 })
    .populate('categoryid')
    .exec(function (err, userData) {
      var transaction = [];

      for (var i = 0; i < userData.length; i++) {
        retJsonObj.list.transaction.push({
          image: userData[i].image,
          tokenCounts: userData[i].tokenCounts,
          tokenName: userData[i].tokenName,
          tokenDesc: userData[i].tokenDesc,
          tokenPrice: userData[i].tokenPrice,
          tokenRoyality: userData[i].tokenRoyality,
          tokenBid: userData[i].tokenBid,
          tokenCreator: userData[i].tokenCreator,
          tokenOwner: userData[i].tokenOwner,
          timestamp: userData[i].timestamp,
          name: userData[i].categoryid.name,
          id: userData[i]._id,
          status: userData[i].status,
          hashValue: userData[i].hashValue,
          balance: userData[i].balance,
          tokenQuantity: userData[i].tokenQuantity
        })
      }
      return res.status(200).json({ 'success': true, 'message': "Colections data", retJsonObj })
    })

}



export const likeData = async (req, res) => {
  var reqBody = req.body;
  ////   //  console.log("("likeData:", reqBody)
  Token.find({ _id: reqBody.data._id }, { likecount: 1 }, { sort: { likecount: -1 }, limit: 1 }).then(
    async (latesuser) => {

      var latestId = 1;
      if (
        latesuser &&
        latesuser.length > 0 &&
        latesuser[0].likecount &&
        latesuser[0].likecount > 0
      ) {
        latestId = parseInt(latesuser[0].likecount) + parseInt(1);
      }



      var checkUser = await User.findOne({ "curraddress": reqBody.currAddr, "deleted": 1 });
      ////   //  console.log("("checkUser:", checkUser, reqBody.data._id)

      if (checkUser != null) {

        var likehistory = {};
        likehistory.image = reqBody.data.image;
        likehistory.tokenCounts = reqBody.data.tokenCounts;
        likehistory.tokenName = reqBody.data.tokenName;
        likehistory.tokenPrice = reqBody.data.tokenPrice;
        likehistory.tokenRoyality = reqBody.data.tokenRoyality;
        likehistory.tokenDesc = reqBody.data.tokenDesc;
        likehistory.tokenCategory = reqBody.data.tokenCategory;
        likehistory.tokenBid = reqBody.data.tokenBid;
        likehistory.tokenProperty = reqBody.data.tokenProperty;
        likehistory.tokenOwner = reqBody.data.tokenOwner;
        likehistory.tokenCreator = reqBody.data.tokenCreator;
        likehistory.likecount = reqBody.data.likecount;

        likehistory.categoryid = reqBody.data.categoryid;
        likehistory.tokenid = reqBody.data._id;



        var test = await User.findOneAndUpdate(
          { _id: checkUser._id },
          {
            $push: { likehistory: likehistory },
          },
          { new: true }
        );


        var test1 = await Token.findOneAndUpdate(
          { _id: reqBody.data._id },
          {
            likecount: latestId,
            // $push: { loginhistory: loginhistory },
          },
          { new: true }
        );

        var likecount = test1.likecount;
        ////   //  console.log("("likecount", likecount)
        return res
          .status(200)
          .json({ success: true, userValue: likecount });



      } else {

        var likehistory = {};
        likehistory.tokenid = reqBody.data._id;
        likehistory.tokenDesc = reqBody.data.tokenDesc;
        likehistory.tokenPrice = reqBody.data.tokenPrice;
        likehistory.tokenCategory = reqBody.data.tokenCategory;
        likehistory.likecount = reqBody.data.likecount;
        likehistory.image = reqBody.data.image;
        likehistory.tokenCounts = reqBody.data.tokenCounts;
        likehistory.tokenName = reqBody.data.tokenName;
        likehistory.tokenRoyality = reqBody.data.tokenRoyality;
        likehistory.tokenBid = reqBody.data.tokenBid;
        likehistory.tokenProperty = reqBody.data.tokenProperty;
        likehistory.tokenOwner = reqBody.data.tokenOwner;
        likehistory.tokenCreator = reqBody.data.tokenCreator;
        likehistory.categoryid = reqBody.data.categoryid;


        var user = new User({
          "likehistory": likehistory,
          "curraddress": reqBody.currAddr
        });

        user.save(async function (err, result) {

          var test1 = await Token.findOneAndUpdate(
            { _id: reqBody.data._id },
            {
              likecount: latestId,
              // $push: { loginhistory: loginhistory },
            },
            { new: true }
          );

          var likecount = test1.likecount;
          ////   //  console.log("("likecount", likecount)
          return res
            .status(200)
            .json({ success: true, userValue: likecount });
        })

      }

    })
}

export const likedDet = async (req, res) => {
  var reqBody = req.body;
  var retJsonObj = {};
  retJsonObj.list = {};
  retJsonObj.list.transaction = [];
  retJsonObj.list.count = [];

  let checkUser = await User.findOne({ "curraddress": reqBody.currAddr, "deleted": 1 });
  if (checkUser != null) {

    if (0 < checkUser.likehistory.length) {

      var likecount = checkUser.likehistory.length;

      retJsonObj.list.count.push({
        count: likecount
      });

      for (var i = 0; i < checkUser.likehistory.length; i++) {

        retJsonObj.list.transaction.push({
          image: checkUser.likehistory[i].image,
          tokenCounts: checkUser.likehistory[i].tokenCounts,
          tokenName: checkUser.likehistory[i].tokenName,
          tokenDesc: checkUser.likehistory[i].tokenDesc,
          tokenPrice: checkUser.likehistory[i].tokenPrice,
          tokenRoyality: checkUser.likehistory[i].tokenRoyality,
          tokenBid: checkUser.likehistory[i].tokenBid,
          tokenCreator: checkUser.likehistory[i].tokenCreator,
          tokenOwner: checkUser.likehistory[i].tokenOwner,
          timestamp: checkUser.likehistory[i].timestamp,
          tokenCategory: checkUser.likehistory[i].tokenCategory,
          tokenProperty: checkUser.likehistory[i].tokenProperty,
          likecount: checkUser.likehistory[i].likecount,
          id: checkUser.likehistory[i]._id,
          status: checkUser.likehistory[i].status,
          hashValue: checkUser.likehistory[i].hashValue
        })
      }

      return res.status(200).json({ 'success': true, 'message': "Colections data", retJsonObj })
    }

  }
}

export const autosaveAddress2 = async (req, res) => {
  var addr = req.body.currAdrr
  if (req.body.currAdrr != "") {
    var find1 = await myItemAddr.findOne({ "currAddress": req.body.currAdrr })
    if (find1 == null) {
      var saveadrr = myItemAddr({
        currAddress: req.body.currAdrr
      })
      saveadrr.save()
        .then(data => {
          res.json(data)
          ////   //  console.log("(data)
        })
        .catch(e => {
          res.json(e)
          ////   //  console.log("(e)
        })

    }
    else {
      ////   //  console.log("("not posted")
    }
  }
  else {
    ////   //  console.log("("not saved")
  }

}

export const autosaveAddress1 = async (req, res) => {
  var addr = req.body.currAddr
  if (addr != "") {
    var find1 = await myItemAddr.findOne({ "currAddress": addr })
    if (find1 == null) {
      var saveadrr = myItemAddr({
        currAddress: addr
      })
      saveadrr.save()
        .then(data => {
          res.json(data)
          ////   //  console.log("(data)
        })
        .catch(e => {
          res.json(e)
          ////   //  console.log("(e)
        })

    }
    else {
      myItemAddr.findOneAndUpdate({ "currAddress": addr }, { $set: { "currAddress": addr } })
    }
  }
  else {
    ////   //  console.log("("not saved")
  }

}
export const followCheck = async (req, res) => {
  var addr = req.params.currAdrr
  // ////   //  console.log("("@#@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + addr)

  var userBalance = await myItemAddr.aggregate([
    { $match: { "curraddress": addr } },
    {
      $lookup:
      {
        from: "tokens",
        localField: "curraddress",
        foreignField: "token",
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
        tokenuser: "$tokenuser",

      }
    }

  ], (err, data) => {
    if (err) return//////   //  console.log("("err" + err)
    res.json(data)
  })

  // ////   //  console.log("("user" + JSON.stringify(userBalance))
}

export const onSaledata1 = async (req, res) => {

  try {
    var reqBody = req.body.currAddr;    //metamask
    var paradd = req.body.currAdrr;
    var address = 0;
    if (paradd === undefined) {

      address = req.body.currAddr
    }
    else {

      address = req.body.currAdrr
    }

    var count = await Token.find({ "tokenOwner": address, "status": "true", "tokenPrice": { $gt: parseFloat(0) } }).count()

    var checkAdd = await Token.aggregate([

      {
        $match: {
          "tokenOwner": String(address), "tokenPrice": { $gt: parseFloat(0) }
        }
      },
      {
        $lookup:
        {
          from: "users",
          localField: "tokenOwner",
          foreignField: "curraddress",
          as: "userprofile"
        },
      },
      {
        $unwind: {
          path: '$userprofile',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup:
        {
          from: "users",
          localField: "tokenCreator",
          foreignField: "curraddress",
          as: "creatorprofile"
        },
      },
      {
        $unwind: {
          path: '$creatorprofile',
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

          image: 1,
          tokenCounts: 1,
          tokenName: 1,
          tokenDesc: 1,
          tokenPrice: 1,
          tokenRoyality: 1,
          tokenCategory: 1,
          tokenBid: 1,
          tokenProperty: 1,
          tokenOwner: 1,
          tokenCreator: 1,
          hashValue: 1,
          status: 1,
          tokenQuantity: 1,
          balance: 1,
          contractAddress: 1,
          minimumBid: 1,
          endclocktime: 1,
          clocktime: 1,
          userprofile: {
            _id: "$userprofile._id",
            image: "$userprofile.image",
            name: "$userprofile.name",
            curraddress: "$userprofile.curraddress",
            coverimage: "$userprofile.coverimage",
            customurl: "$userprofile.customurl"

          },
          creatorprofile: {
            _id: "$creatorprofile._id",
            image: "$creatorprofile.image",
            name: "$creatorprofile.name",
            curraddress: "$creatorprofile.curraddress",
            coverimage: "$creatorprofile.coverimage",
            customurl: "$creatorprofile.customurl"
          },
          usercontract: {
            imageUser: "$usercontract.imageUser",
            type: "$usercontract.type",
            name: "$usercontract.name",
            url: "$usercontract.url",
            conAddr: "$usercontract.conAddr"

          },

        }
      }


    ], (err, data) => {
      if (err) {
        res.json({ "errors": err })
        console.log("err" + err)
      }
      else {
        res.json({ data: data, count: count })
      }
    })

  }



  catch (e) {
    return res.json(e)

  }
}

export const collectibledata = async (req, res) => {

  try {
    var reqBody = req.body.currAddr;    //metamask
    var paradd = req.body.currAdrr;
    var address = 0;
    if (paradd === undefined) {
      console.log(")))))))))))))))))))If working")
      address = req.body.currAddr
    }
    else {
      console.log(")))))))))))))))))((((((((((((((((Else Working)))))))))))))))) working")
      address = req.body.currAdrr
    }
    var count = await Token.find({ "tokenOwner": address, "status": "true" }).count()
    // console.log("sajhdgasjgdgasgdsagdjahsgdhjasgdjasgdjhasgdhjasgdhjasgjdgasg"+count)
    var checkAdd = await Token.aggregate([

      {
        $match: {
          "tokenOwner": String(address)
        }
      },
      {
        $lookup:
        {
          from: "users",
          localField: "tokenOwner",
          foreignField: "curraddress",
          as: "userprofile"
        },
      },
      {
        $unwind: {
          path: '$userprofile',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup:
        {
          from: "users",
          localField: "tokenCreator",
          foreignField: "curraddress",
          as: "creatorprofile"
        },
      },
      {
        $unwind: {
          path: '$creatorprofile',
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

          image: 1,
          tokenCounts: 1,
          tokenName: 1,
          tokenDesc: 1,
          tokenPrice: 1,
          tokenRoyality: 1,
          tokenCategory: 1,
          tokenBid: 1,
          tokenProperty: 1,
          tokenOwner: 1,
          tokenCreator: 1,
          hashValue: 1,
          status: 1,
          tokenQuantity: 1,
          balance: 1,
          contractAddress: 1,
          minimumBid: 1,
          endclocktime: 1,
          clocktime: 1,

          userprofile: {
            _id: "$userprofile._id",
            image: "$userprofile.image",
            name: "$userprofile.name",
            curraddress: "$userprofile.curraddress",
            coverimage: "$userprofile.coverimage",
            customurl: "$userprofile.customurl"
          },
          creatorprofile: {
            _id: "$creatorprofile._id",
            image: "$creatorprofile.image",
            name: "$creatorprofile.name",
            curraddress: "$creatorprofile.curraddress",
            coverimage: "$creatorprofile.coverimage",
            customurl: "$creatorprofile.customurl"
          },
          usercontract: {
            imageUser: "$usercontract.imageUser",
            type: "$usercontract.type",
            name: "$usercontract.name",
            url: "$usercontract.url",
            conAddr: "$usercontract.conAddr"

          },

        }
      }


    ], (err, data) => {
      if (err) {
        res.json({ "errors": err })
        console.log("err" + err)
      }
      else {
        res.json({ data: data, count: count })
        console.log(data)
      }
    })

    //console.log("++++++++++++++++++++++++"+JSON.stringify(checkAdd))
  }



  catch (e) {
    return res.json(e)

  }


}

export const creatorVal = async (req, res) => {
  try {
    var reqBody = req.body.currAddr;    //metamask
    var paradd = req.body.currAdrr;
    var address = 0;
    if (paradd === undefined) {
      console.log(")))))))))))))))))))If working")
      address = req.body.currAddr
    }
    else {
      console.log(")))))))))))))))))((((((((((((((((Else Working)))))))))))))))) working")
      address = req.body.currAdrr
    }
    var count = await Token.find({ "tokenCreator": address, "status": "true" }).count()
    // console.log("sajhdgasjgdgasgdsagdjahsgdhjasgdjasgdjhasgdhjasgdhjasgjdgasg"+count)
    var checkAdd = await Token.aggregate([

      {
        $match: {
          "tokenCreator": String(address)
        }
      },
      {
        $lookup:
        {
          from: "users",
          localField: "tokenOwner",
          foreignField: "curraddress",
          as: "userprofile"
        },
      },
      {
        $unwind: {
          path: '$userprofile',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup:
        {
          from: "users",
          localField: "tokenCreator",
          foreignField: "curraddress",
          as: "creatorprofile"
        },
      },
      {
        $unwind: {
          path: '$creatorprofile',
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

          image: 1,
          tokenCounts: 1,
          tokenName: 1,
          tokenDesc: 1,
          tokenPrice: 1,
          tokenRoyality: 1,
          tokenCategory: 1,
          tokenBid: 1,
          tokenProperty: 1,
          tokenOwner: 1,
          tokenCreator: 1,
          categoryid: 1,
          hashValue: 1,
          status: 1,
          tokenQuantity: 1,
          balance: 1,
          contractAddress: 1,
          minimumBid: 1,
          endclocktime: 1,
          clocktime: 1,

          userprofile: {
            _id: "$userprofile._id",
            image: "$userprofile.image",
            name: "$userprofile.name",
            curraddress: "$userprofile.curraddress",
            coverimage: "$userprofile.coverimage",
            customurl: "$usersinfo.customurl"
          },
          creatorprofile: {
            _id: "$creatorprofile._id",
            image: "$creatorprofile.image",
            name: "$creatorprofile.name",
            curraddress: "$creatorprofile.curraddress",
            coverimage: "$creatorprofile.coverimage",
            customurl: "$creatorprofile.customurl"
          },
          usercontract: {
            imageUser: "$usercontract.imageUser",
            type: "$usercontract.type",
            name: "$usercontract.name",
            url: "$usercontract.url",
            conAddr: "$usercontract.conAddr"

          },
        }
      }


    ], (err, data) => {
      if (err) {
        res.json({ "errors": err })
        console.log("err" + err)
      }
      else {
        res.json({ data: data, count: count })
        console.log(data)
      }
    })

    //console.log("++++++++++++++++++++++++"+JSON.stringify(checkAdd))
  }



  catch (e) {
    return res.json(e)

  }
}




export const checkAddress = async (req, res) => {

  var filter = req.body.currAddr;
  // ////   //  console.log("("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"+req.body)
  var checkAdd = await myItemAddr.aggregate([
    {
      $match: { "currAddress": filter }
    },
    {
      $lookup:
      {
        from: "tokens",
        localField: "currAddress",
        foreignField: "tokenCreator",
        as: "checkAdd"
      },
    },
    {
      $unwind: {
        path: '$checkAdd',
        preserveNullAndEmptyArrays: true,
      }
    },

    {
      $project: {
        id: 1,
        currAddress: 1,
        createdAt: 1,
        deleted: 1,
        checkAdd: "$checkAdd"
      }
    }

  ]
    , (err, data) => {
      if (err) {
        res.json({ "errors": err })
        //////   //  console.log("("err" + err)
      }
      else {
        res.json(data)
        //////   //  console.log("(data)
      }
    }
  )

  // ////   //  console.log("("!!!!!!!!!!checkAdd" + JSON.stringify(checkAdd))
  // return res.json(checkAdd)


}



export const changeStatus = async (req, res) => {
  var reqStatus = req.body.status;
  var hashValue = req.body.hashValue;
  ////   //  console.log("(reqStatus + "  55555555555555555555555555555555555555555555555555555555555555555555555555      :          ")
  Token.findOneAndUpdate({ "hashValue": hashValue }, { $set: { "status": reqStatus } })
    .then((data) => {
      res.json(data)
    })
    .catch((e) => {
      res.json({ "err ": e })
    })

}

export const pics = async (req, res) => {


  var reqBody = req.body.currAddr;    //metamask
  var paradd = req.body.currAdrr;
  var address = 0;
  //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++If working" + req.body.currAddr + "/" + req.body.currAdrr)
  if (paradd === undefined) {
    // //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++If working"+req.body.currAddr)
    address = req.body.currAddr
  }
  else {
    //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++else working" + req.body.currAdrr)
    address = req.body.currAdrr
  }
  var findpic = await User.findOne({ "curraddress": address })
  //console.log("11111111111111111111111111111111111111111111111111111111111111111111111111111111" + address)
  if (findpic != null) {
    res.json(findpic)
    //console.log("```````````````````````````````````````````````````````````````````````````````````````````````" + findpic)
  }


}


export const getfollowFunction = async (req, res) => {
  try {
    var reqBody = req.body;
    //var follow = reqBody.followstatus;
    var currAddr = reqBody.currAddr; //metamask
    var myUserAddr = reqBody.currAdrr;
    var add = await Follow.findOne({ "follower": currAddr, "owner": myUserAddr })
    console.log("folodfjbdfkhbd " + JSON.stringify(add));
    if (add == null) {
      res.json(false);
    }
    else {
      res.json(true)
    }


  }
  catch (e) {
    res.json(e)
  }
}


export const followFunction = async (req, res) => {
  try {
    var reqBody = req.body;
    //var follow = reqBody.followstatus;
    var currAddr = reqBody.currAddr; //metamask
    var myUserAddr = reqBody.currAdrr;
    var store = new Follow({
      "owner": myUserAddr,
      "follower": currAddr
    })
    // var storeFollowing = new Following({
    //   "owner": currAddr,
    //   "following": myUserAddr
    // })
    var activity = new Activity({
      "owner": currAddr,
      "user": myUserAddr,
      "activity": "started Following"

    })
    var data = store.save();
    var act = activity.save();
    //var da = storeFollowing.save();

  }
  catch (e) {
    res.json(e)
  }
}
export const unfollowFunction = async (req, res) => {
  try {
    var reqBody = req.body;
    //var follow = reqBody.followstatus;
    var currAddr = reqBody.currAddr;
    var myUserAddr = reqBody.currAdrr;
    console.log("Unfollow ")
    await Follow.findOne({ "follower": currAddr, "owner": myUserAddr }).remove();
    //await Following.findOne({"owner": currAddr ,"following": myUserAddr}).remove();

  }
  catch (e) {
    res.json(e)
  }
}
export const followerDetails = async (req, res) => {
  try {
    var paradd = req.body.currAdrr;
    // var address = req.body.currAdrr;
    var myUserAddr = 0;
    if (paradd === undefined) {

      myUserAddr = req.body.currAddr
    }
    else {

      myUserAddr = req.body.currAdrr
    }
    // var reqBody = req.body;
    // //var follow = reqBody.followstatus;
    // var currAddr = reqBody.currAddr; //metamask
    // var myUserAddr = 0
    //  myUserAddr = reqBody.currAdrr;
    var userBalance = await Follow.aggregate([
      {
        $match: { owner: String(myUserAddr) }
      },
      { $sort: { "timestamp": -1 } },
      {
        $lookup:
        {
          from: "users",
          localField: "follower",
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
        $project: {
          _id: 1,
          follower: 1,
          usersinfo: {
            _id: "$usersinfo._id",
            image: "$usersinfo.image",
            name: "$usersinfo.name",
            curraddress: "$usersinfo.curraddress",
            customurl: "$usersinfo.customurl"
          },

        }
      }

    ], (err, data) => {
      if (err) return//////consol.log("err" + err)
      res.json(data)
      ////consol.log("!!!!!!!!!!!!!!!!!!!!!!!!!"+JSON.stringify(data))
    })

  }
  catch (e) {
    res.json(e)
  }
}
export const followingDetails = async (req, res) => {
  try {
    var paradd = req.body.currAdrr;
    // var address = req.body.currAdrr;
    var myUserAddr = 0;
    if (paradd === undefined) {

      myUserAddr = req.body.currAddr
    }
    else {

      myUserAddr = req.body.currAdrr
    }
    // var reqBody = req.body;
    // //var follow = reqBody.followstatus;
    // var currAddr = reqBody.currAddr; //metamask
    // var myUserAddr = reqBody.currAdrr;
    var userBalance = await Follow.aggregate([
      {
        $match: { follower: String(myUserAddr) }
      },
      { $sort: { "timestamp": -1 } },
      {
        $lookup:
        {
          from: "users",
          localField: "owner",
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
        $project: {
          _id: 1,
          follower: 1,
          usersinfo: {
            _id: "$usersinfo._id",
            image: "$usersinfo.image",
            name: "$usersinfo.name",
            curraddress: "$usersinfo.curraddress",
            customurl: "$usersinfo.customurl"
          },

        }
      }

    ], (err, data) => {
      if (err) return//////consol.log("err" + err)
      res.json(data)
      ////consol.log("!!!!!!!!!!!!!!!!!!!!!!!!!"+JSON.stringify(data))
    })

  }
  catch (e) {
    res.json(e)
  }
}
export const activityDetails = async (req, res) => {
  try {
    var paradd = req.body.currAdrr;
    // var address = req.body.currAdrr;
    var myUserAddr = 0;
    if (paradd === undefined) {

      myUserAddr = req.body.currAddr
    }
    else {

      myUserAddr = req.body.currAdrr
    }
    // var reqBody = req.body;
    // //var follow = reqBody.followstatus;
    // var currAddr = reqBody.currAddr; //metamask
    // var myUserAddr = reqBody.currAdrr;
    var userBalance = await Activity.aggregate([
      {
        $match: { owner: String(myUserAddr) }
      },
      { $sort: { "timestamp": -1 } },
      {
        $lookup:
        {
          from: "users",
          localField: "user",
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
        $project: {
          _id: 1,
          owner: 1,
          activity: 1,
          user: 1,
          usersinfo: {
            _id: "$usersinfo._id",
            image: "$usersinfo.image",
            name: "$usersinfo.name",
            curraddress: "$usersinfo.curraddress",
            customurl: "$usersinfo.customurl"
          },

        }
      }

    ], (err, data) => {
      if (err) return//////consol.log("err" + err)
      res.json(data)
      ////consol.log("!!!!!!!!!!!!!!!!!!!!!!!!!"+JSON.stringify(data))
    })

  }
  catch (e) {
    res.json(e)
  }
}
export const onFollower = async (req, res) => {
  var paradd = req.body.currAdrr;
  // var address = req.body.currAdrr;
  var address = 0;
  if (paradd === undefined) {

    address = req.body.currAddr
  }
  else {

    address = req.body.currAdrr
  }
  var count = await Follow.find({ "owner": address }).count()
  res.json(count)

}
export const onFollowing = async (req, res) => {
  var paradd = req.body.currAdrr;
  // var address = req.body.currAdrr;
  var address = 0;
  if (paradd === undefined) {

    address = req.body.currAddr
  }
  else {

    address = req.body.currAdrr
  }
  var count = await Follow.find({ "follower": address }).count()
  console.log("ONFollowing Count@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" + JSON.stringify(count))
  res.json(count)

}
export const onActivity = async (req, res) => {
  var paradd = req.body.currAdrr;
  // var address = req.body.currAdrr;
  var address = 0;
  if (paradd === undefined) {

    address = req.body.currAddr
  }
  else {

    address = req.body.currAdrr
  }
  var count = await Activity.find({ "owner": address }).count()
  console.log("ONActivity Count@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" + JSON.stringify(count))
  res.json(count)

}


// 28 parama

export const allActivity = async (req, res) => {
  try {
    // var paradd = req.body.currAdrr;
    // // var address = req.body.currAdrr;
    // var myUserAddr =0;
    // if (paradd === undefined) {

    //   myUserAddr = req.body.currAddr
    // }
    // else {

    //   myUserAddr = req.body.currAdrr
    // }
    // var reqBody = req.body;
    // //var follow = reqBody.followstatus;
    // var currAddr = reqBody.currAddr; //metamask
    // var myUserAddr = reqBody.currAdrr;
    var userBalance = await Activity.aggregate([
      // {
      //         $match: { owner: String(myUserAddr) }
      // },
      { $sort: { "timestamp": -1 } },
      {
        $lookup:
        {
          from: "users",
          localField: "owner",
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
        $project: {
          _id: 1,
          owner: 1,
          activity: 1,
          user: 1,
          usersinfo: {
            _id: "$usersinfo._id",
            image: "$usersinfo.image",
            name: "$usersinfo.name",
            curraddress: "$usersinfo.curraddress",
            customurl:"$usersinfo.customurl"
          },

        }
      }

    ], (err, data) => {
      if (err) return//////consol.log("err" + err)
      res.json(data)
      ////consol.log("!!!!!!!!!!!!!!!!!!!!!!!!!"+JSON.stringify(data))
    })

  }
  catch (e) {
    res.json(e)
  }
}
export const topSellers = async (req, res) => {
  // User.find({}, { userid: 1 }, { sort: { userid: -1 }e, limit: 1 })
  var data = await User.find({}, {}).sort({ saleAmount: -1 }).limit(4);

  if (data && data.length > 0) {
    // console.log("Error Checking "+err)
    return res
      .status(200)
      .json(data);
  } else {
    return res
      //.status(200)
      .json([]);


  }
  ////   //  console.log("(data)


}
export const topBuyers = async (req, res) => {
  var data = await User.find({}, {}).sort({ buyAmount: -1 }).limit(4);

  if (data && data.length > 0) {
    // console.log("Error Checking "+err)
    return res
      .status(200)
      .json(data);
  } else {
    return res
      //.status(200)
      .json([]);


  }

}
/*me kala*/
export const getSearchResult = async (req, res) => {

  var reqParam = req.params._key;
  var pattern = new RegExp('(' + reqParam + ')', 'gi')
  User.find({ "name": pattern }, (err, userdata) => {
    Token.find({ "tokenName": pattern }, (err, tokendata) => {
      Contract.find({ "name": pattern }, (err, contractsdata) => {
        res.json({ success: true, data: userdata, itemdata: tokendata, contractdata: contractsdata });
      })
    })
  })
}
export const getreport = async (req, res) => {
  console.log("report>>>>>>",req.body)
  var ReqBody = req.body; 
  var currAddr = ReqBody.currAdd; //metamask
  var rep = ReqBody.rep;
  var report = new ReportDb({
    currAddr: currAddr,
    report: rep,
  
  })
  console.log("report>>>>>>",report)
  var reports = report.save().then((result) => {
    console.log("uploooooooooooo")
    res.json(result);
  });
  
  }