import moment from 'moment';
import Admin from '../Model/admin';
import User from '../../../models/User';
import Settings from '../Model/settings';
import Faq from '../Model/faq';
import EmailTemplate from "../Model/emailTemplate";
import { sendEmail } from "../config/emailGateway";
import bcrypt from 'bcrypt';
import config from "../../../config/config";
import multer from "multer";
import path from "path";
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import axios from 'axios';
import Category from '../../../models/category';
import Cms from '../Model/cms.js';
import ContactUs from '../Model/contact';
import Support from '../Model/support';
import Token from '../../../models/Token';
import Bids from '../../../models/bid';
import Microownership from '../../../models/microownership';
import MicroBoolSlot from '../../../models/microSlotBooking'
import ReportSchema from '../../../models/reports';
import tokenOwnerDb from '../../../models/TokenOwner'
import servicefee from '../../../models/servicefee'
import cmsnew from '../Model/cmsnew'
import isEmpty from '../../../config/isEmpty';
const { ObjectId } = require("mongodb");
/**
 * User Login
 * URL : /api/login
 * METHOD: POST
 * BODY : email, phoneNo, phoneCode, loginType (1-mobile, 2-email), password
*/
export const userLogin = async (req, res) => {
try {
	console.log(req.body)
	let reqBody = req.body, checkUser;
	var em = reqBody.email.toLowerCase();
	console.log(em);
	checkUser = await Admin.findOne({ "email": em });
	console.log(req.body,checkUser)
	if (!checkUser) {
	return res.status(400).json({ "success": false, 'errors': { 'email': "Email is not exists" } })
	}

	console.log(checkUser)
	var passwordStatus = bcrypt.compareSync(reqBody.password, checkUser.password);

	if (!passwordStatus) {
	return res.status(400).json({ "success": false, 'errors': { "password": "Invalid Password" } })
	}
	console.log(checkUser,passwordStatus)

	let payloadData = {
	"_id": checkUser._id
	}
	let token = new Admin().generateJWT(payloadData);
	let result = {
	'_id': checkUser._id,
	'email': checkUser.email,
	'name': checkUser.name
	}
	console.log(token,result)

	return res.status(200).json({ 'success': "true", 'message': "Login successfully", token, result })
}
catch (err) {
	console.log('err : ', err);
	return res.status(500).json({ "success": "false", 'errors': { 'messages': "Error on server" } })
}
}
export const getemailTemplateList = async (req, res) => {

const emailData = await EmailTemplate.find({});

return res
	.status(200)
	.json({ success: "true", userValue: emailData });


}
export const gettokencount = async (req, res) => {
const countData = await tokenOwnerDb.find({"deleted" : 1, "balance" : { $ne : 0 }}).count();
const userCountData = await User.find({"deleted":1}).count();
// const countData = await Token.find({"deleted":1}).count();
// const countData = await Token.find({"deleted":1}).count();
console.log("countData",countData,userCountData)
return res
	.status(200)
	.json({ countData: countData , userCountData:userCountData});
}

export const getuserslist = async (req,res)=>{
var userValue= await User.find({})
if(userValue!=null){
	console.log(userValue)
	return res.json(userValue)
}
else{
	return res.json({})
}
}

export const getuser = async (req, res) => {

User.findOne({ _id: req.params.id }, (err, userData) => {
	if (err) {
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}
	console.log(userData)
	return res
	.status(200)
	.json({ success: true, userValue: userData });
});
}


export const getreportlist = async (req, res) => {

ReportSchema.find({"noofitem":{"$ne":0}}, (err, userData) => {
	if (err) {
	return res
		.status(200)
		.json({ success: "false", errors: { messages: "Error on server" } });
	}
	console.log("lakslaklsklaklsklakslkalsklalsklakslalsklaklslakslalsklalskalslk",userData)
	return res
	.status(200)
	.json({ success: "true", userValue: userData });
})
// try{
//   var userData=await ReportSchema.aggregate([
//     {
//       $match:{
//         "noofitem":{
//           $ne:0
//         }
//       },
//     },
//       {
//       $lookup:{
//         from:'tokens',
//         localField:'imageOwner',
//         from:'tokenOwner',
//         as:'tokenDb'
//       }
//     },
//     {
//       $unwind:{
//         path:'$tokenOwnerDb',
//         preserveNullAndEmptyArrays: true,
		
//       }
//     },
//     {
//       $lookup:{
//         from:'tokenowners',
//         localField:'imageOwner',
//         from:'tokenOwner',
//         as:'tokenOwnerDb'
//       }
//     },
//     {
//       $unwind:{
//         path:'$tokenOwnerDb',
//         preserveNullAndEmptyArrays: true,
		
//       }
//     },
//     {
//       $project:{
//         _id: 1,
//         imageName: 1,
//         imagehash: 1,
//         currAddr: 1,
//         imageOwner: 1,
//         imageId: 1,
//         imageType: 1,
//         imageContractAddress: 1,
//         report: 1,
//         noofitems: 1,
//         burnToken: 1,
//         CreatedAt: 1,
//         tokenOwnerDb:{
//           tokenPrice:'$tokenOwnerDb.tokenPrice',
//           tokenOwner:'$tokenOwnerDb.tokenOwner',
//           balance:'$tokenOwnerDb.balance'
//         },
//         tokenOwnerDb:{
//           tokenPrice:'$tokenOwnerDb.tokenPrice',
//           tokenOwner:'$tokenOwnerDb.tokenOwner',
//           balance:'$tokenOwnerDb.balance'
//         },
	
//       }
//     }
	
//   ])
//       return res
//         .status(200)
//         .json({ success: "true", userValue: userData });
	
//     }
//     catch(e){
//           return res
//         .status(400)
//         .json({ success: "fail", userValue: e });
	
//     }
}



// fjshfkjshfjkhsdjkfhjksdhfjkshdjkfhsjkdfhjksdhfjksdhfjksdhfjk {
//   tokenOwner: '0x08343a8ced0355449d8096e40103da0a8b12b951',
//   tokenCounts: 24,
//   blockHash: '0xee2021b9fd53421212686188329172e73c60d10660359b977bd64087bb9ca3bb',
//   transactionHash: '0xb64b3a585d064a04d000b1f572de43e1369fa723c7e23a0e7a5dfef521af8e2a',
//   tokenConractAdd: '0x7b1DAd3BEe40DDc88EB50280b4EE0EC2D2A8c1a8',
//   type: 721,
//   balance: '1',
//   currAddr: '0x08343a8ced0355449d8096e40103da0a8b12b951'
// }
export const BurnField = async (req, res) => {
console.log("dfjshfkjshfjkhsdjkfhjksdhfjkshdjkfhsjkdfhjksdhfjksdhfjksdhfjk",req.body);

try {



	var reqBody = req.body;
	var action = "reportPage";
	var checkQil=req.body.actionVal !== undefined && (req.body.actionVal!=""?req.body.actionVal:"")
	if(action ==checkQil ){
	let report = await ReportSchema.findOne({ "imageId": reqBody.tokenCounts, "imageOwner": reqBody.tokenOwner,"imageContractAddress":reqBody.contractAddress});

	if (report) {
		console.log(typeof report.noofitems,typeof reqBody.balance)
	
		var ch1= await  ReportSchema.findOneAndUpdate({ "imageId": reqBody.tokenCounts, "imageOwner": reqBody.tokenOwner,"imageContractAddress":reqBody.contractAddress} ,
		{$set:{
		"noofitems":(report.noofitems)-parseInt(reqBody.balance),
		"burnToken":(report.burnToken)+parseInt(reqBody.balance)
		}
	},{new:true}
	);
		console.log("report",ch1)
	}
	else{
		var sv=new ReportSchema({
		noofitems:reqBody.quant-reqBody.balance,
		imageId:reqBody.tokenCounts,
		imageOwner:reqBody.tokenOwner,
		imageContractAddress:reqBody.contractAddress,
		currAddr:reqBody.currAddr,
		burnToken:reqBody.balance,
		Links:req.body.Links
		})
		sv.save()
		console.log("sv",sv)
	}
	}
	let checkUser = await Token.findOne({ "tokenCounts": reqBody.tokenCounts, "tokenOwner": reqBody.tokenOwner,"contractAddress":reqBody.contractAddress,"type":reqBody.type });
	let checkUser1 = await tokenOwnerDb.findOne({ "tokenCounts": reqBody.tokenCounts, "tokenOwner": reqBody.tokenOwner,"contractAddress":reqBody.contractAddress,"type":reqBody.type });
	// console.log(checkUser,checkUser1,report)
	if (checkUser) {
	var ch= await Token.findOneAndUpdate(
	{ "tokenCounts": reqBody.tokenCounts,
	"tokenOwner": reqBody.tokenOwner,
	"contractAddress":reqBody.contractAddress
	} ,
	{$set:{
	"balance":((checkUser.balance)-parseInt(reqBody.balance)),
	"burnToken":(checkUser.burnToken)+parseInt(reqBody.balance),

	}},
	{new:true},
);
	console.log("token",ch)
	}


	if (checkUser1) {
	var ch2= await   tokenOwnerDb.findOneAndUpdate({ "tokenCounts": reqBody.tokenCounts, "tokenOwner": reqBody.tokenOwner,"contractAddress":reqBody.contractAddress}
	,{$set:{
		"balance":((checkUser1.balance)-parseInt(reqBody.balance)),
		"burnToken":(checkUser1.burnToken)+parseInt(reqBody.balance)
		}
	},
	{new:true}
	);
	console.log("tokenowner",ch2)
	}
	// console.log(checkUser,checkUser1,report);


	return res
	.status(200)
	.json({ success: true, message: "Burned Updated Successfully" });
} catch (err) {
	console.log("----err", err)

	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}


export const verifiedNft = async (req,res) => {
	try {
		var ReqBody = req.body;
		var tokenCounts = ReqBody.tokenCounts;
		var verified = ReqBody.verified;
		var tokenVerifydata = await Token.update({tokenCounts : tokenCounts} , {$set : { verified : verified}} , {new : true})
		if (tokenVerifydata) {
			return res
			.status(200)
			.json({ success: true, message: "Verified Successfully" });
		} else {
			return res
			.status(200)
			.json({ success: true, message: "Oops something went to wrong" });
		}
	}catch(error) {	
		return res
			.status(200)
			.json({ success: false, message: "Error occured" });
	}
}
export const getReportView = async (req, res) => {
console.log("lakslaklsklaklsklakslkalsklalsklakslalsklaklslakslalsklalskalslk")
// res.json("kjshahakaks")
ReportSchema.findOne({_id:req.params.id}, (err, userData) => {
	if (err) {
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}
	console.log("lakslaklsklaklsklakslkalsklalsklakslalsklaklslakslalsklalskalslk",userData)
	return res
	.status(200)
	.json({userValue: userData });
})
}






export const getemailTemplate = async (req, res) => {


const emailData = await EmailTemplate.findOne({ _id: req.params.id })
return res
	.status(200)
	.json({ success: true, userValue: emailData });

}

export const updateEmailTemplate = async (req, res) => {
try {

	var reqBody = req.body;
	let checkTemplate = await EmailTemplate.findOne({ "subject": reqBody.subject, });

	const emailData = await EmailTemplate.findOneAndUpdate(
	{ "_id": reqBody.Id },
	{
		subject: reqBody.subject,
		identifier: reqBody.identifier,
		content: reqBody.content,
	}
	);

	return res
	.status(200)
	.json({ success: true, message: "EmailTemplate Updated Successfully" });
} catch (err) {

	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
export const communityaddcategory =async(req,res)=>{
const reqBody = req.body;
	CommunityCategory.findOne({name:req.body.category,deleted:1}).exec(async function(err,resp){
	if(!resp){
		let categoryadd = new CommunityCategory({
		name:req.body.category,
		description:req.body.description
		});
	categoryadd.save().then((done) => {
		return res.status(200).send({message:"Successfully Saved"});         
	})
	}else{
		return res.status(400).send({message:"Category Already exist"}); 
	}
	})
}
export const communitycategorydetail =async(req,res)=>{
const reqBody = req.body;
CommunityCategory.findOne({deleted:1,_id:req.body.id}).exec(async function(err,resp){
	if(resp){
		return res.status(200).send({data:resp});         
	}
	})
}

export const communityupdatecategory=async(req,res)=>{
CommunityCategory.findOneAndUpdate({_id:req.body.userId},{name:req.body.category,description:req.body.description}).exec(async function(err,resp){
	if(resp){
		return res.status(200).send({message:"Updated Successfully"});         
	}else{
		return res.status(200).send({errmessage:"Some Error Occured , Try again later"}); 
	}
	})
}
export const communitycategorylist = (req, res) => {

	CommunityCategory.find({ deleted: 1 }, (err, userData) => {
	if (err) {
	console.log(err);
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
});

}
export const communitydeletecategory=async(req,res)=>{
CommunityCategory.findOneAndUpdate({_id:req.body.id},{deleted:0}).exec(async function(err,resp){
	if(resp){
		return res.status(200).send({message:"Deleted Successfully"});         
	}else{
		return res.status(200).send({errmessage:"Some Error Occured , Try again later"}); 
	}
	})
}
export const deletesupport = async (req, res) => {
try {
	let deleteuser = await Support.findOneAndRemove({ _id: new mongoose.Types.ObjectId(req.params.id) });

	return res
	.status(200)
	.json({ success: true, message: "Support Details Deleted Successfully" });
} catch (err) {
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
export const addpair = (req, res) => {
const reqBody = req.body;
console.log("reqBO", reqBody)
var pair = new Swappair({
	"name": reqBody.name
})

pair.save(async function (err, rest) {
	return res.status(200).json({ 'success': true, 'message': "Pair details added successfully", rest })

});
}
export const addcategory = async (req, res) => {
const reqBody = req.body;

const categoryData = await Category.findOne({ "name": reqBody.name });
console.log("categoryData", categoryData)
if (categoryData) {

	return res.status(400).json({ "success": false, 'errors': { 'name': "Category is already exists" } })

}

var category = await Category({
	"name": reqBody.name
})

category.save(async function (err, rest) {
	return res.status(200).json({ 'success': true, 'message': "Category details added successfully", rest })

});
}
export const addtoken = async (req, res) => {
const reqBody = req.body;

const tokenData = await Token.findOne({ "name": reqBody.name });
if (tokenData) {

	return res.status(400).json({ "success": false, 'errors': { 'name': "Token is already exists" } })
}

if (req.files != undefined && req.files.Photofile != undefined) {
	var token = await Token({
	"name": reqBody.name,
	"tokenPrice": reqBody.price,
	"tokencount": reqBody.tokencount,
	"tokenroyality": reqBody.tokenroyality,
	"tokendesc": reqBody.tokendesc,
	"tokenimage": req.files.Photofile[0].filename
	})
} else {
	var token = await Token({
	"name": reqBody.name,
	"tokenPrice": reqBody.price,
	"tokencount": reqBody.tokencount,
	"tokenroyality": reqBody.tokenroyality,
	"tokendesc": reqBody.tokendesc
	})
}
token.save(async function (err, rest) {
	return res.status(200).json({ 'success': true, 'message': "Token details added successfully", rest })

});
}

export const addcategorydet = (req, res) => {
const reqBody = req.body;

if (req.files != undefined && req.files.Photofile != undefined) {

	var categoryDet = new CategoryDet({
	"categoryid": reqBody.categoryname,
	"tokenCounts": reqBody.tokenname,
	"image": req.files.Photofile[0].filename
	})
} else {
	var categoryDet = new CategoryDet({
	"categoryid": reqBody.categoryname,
	"tokenCounts": reqBody.tokenname
	})
}

categoryDet.save(async function (err, rest) {
	return res.status(200).json({ 'success': true, 'message': "Category details added successfully", rest })

});
}

export const getCmsData = async (req, res) => {

try {
	const id = req.params.id;
	const cmsData = await Cms.findOne({ "_id": id });
	return res
	.status(200)
	.json({ success: true, cmsData: cmsData });


} catch (err) {
	res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
export const getContactUs = async (req, res) => {

const contactData = await ContactUs.find({}).sort({ _id: -1 });
return res
	.status(200)
	.json({ contactData: contactData });


}
export const getContactDetails = async (req, res) => {

const id = req.params.id;


const contactData = await ContactUs.findOne({ "_id": id });
return res
	.status(200)
	.json({ contactData: contactData });


}
export const updatecontact = async (req, res) => {
console.log("updatecontact", req.body)
try {
	var reqBody = req.body;

	var contactid = reqBody.userId;

	var test = await ContactUs.findOneAndUpdate(
	{ _id: new mongoose.Types.ObjectId(contactid) },
	{
		replymsg: reqBody.replymsg,
		replydate: Date.now(),
	}
	);

	return res
	.status(200)
	.json({ success: true, message: "Contactus Updated Successfully" });
} catch (err) {
	console.log("error", err)

}
}
export const getChats = async (req, res) => {

try {

	const id = req.params.id
	const ticketChats = await Support.find({ "_id": id });
	return res
	.status(200)
	.json({ ticketDatas: ticketChats });

}

catch (err) {

	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });

}
}
export const adminReplay = async (req, res) => {

try {
	console.log("req.bo", req.body)
	console.log("supportId", req.params)

	const supportId = req.params.id
	let reqBody = req.body, errors = {};
	var replayDetails = {};
	replayDetails.message_query = reqBody.replay;
	replayDetails.replytype = "Admin";

	if (reqBody.replay == "") {
	return res
		.status(400)
		.json({ success: false, errors: { replay: "Message Field Required" } })
	}
	Support.findOneAndUpdate(
	{ _id: new mongoose.Types.ObjectId(supportId) },
	{
		$push: { reply: replayDetails },
	},
	{ new: true },
	function (selltemp_err, ticketData) {

		//   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>", ticketData);
		//  socketEmitOne("Admin_replay",ticketData.reply,ticketData.userid);
		var tiketId = ticketData._id.toString();
		// socketEmitAll("Admin_replay-"+tiketId, ticketData)

	})

	return res
	.status(200)
	.json({ message: " message sent successfully to user" });


}

catch (err) {
	console.log("err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });

}
}
export const deletesupportchat = async (req, res) => {

try {
	const replay_id = req.params.id;
	const ticketid = req.body.ticketid;

	const deleteChatData = await Support.findOne({ "_id": ticketid })

	var filtered = deleteChatData.reply.filter(function (el) {
	if (el._id == replay_id) {
		return el
	}
	});


	if (filtered[0].message_query == deleteChatData.supportMessage) {
	const updatedata = await Support.updateOne({ "_id": ticketid }, { $set: { supportMessage: "" } }, { new: true })
	Support.findOneAndUpdate(
		{ "_id": ObjectId(ticketid) },
		{ $pull: { 'reply': { _id: ObjectId(replay_id) } } }, function (err, data) {
		if (err) {
			console.log(err);
			return res.send(err);
		}

		});

	}
	else {

	Support.findOneAndUpdate(
		{ "_id": ObjectId(ticketid) },
		{ $pull: { 'reply': { _id: ObjectId(replay_id) } } }, function (err, model) {
		if (err) {
			console.log(err);
			return res.send(err);
		}

		});

	}

	return res
	.status(200)
	.json({ success: true, message: "Support Details Deleted Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
export const getSupportList = async (req, res) => {

try {

	const data = await Support.find({}).sort({ "_id": -1 });
	return res
	.status(200)
	.json({ supportData: data });
}

catch (err) {
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
export const deletecontact = async (req, res) => {
console.log(req.params.id, "deletecontact ")
try {
	let deleteuser = await ContactUs.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

	return res
	.status(200)
	.json({ success: true, message: "Contactus Deleted Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
export const updateCmsData = async (req, res) => {
try {

	var reqBody = req.body;
	console.log("data", reqBody);

	var test = await Cms.findOneAndUpdate(
	{ _id: new mongoose.Types.ObjectId(reqBody.Id) },
	{
		subject: reqBody.subject,
		identifier: reqBody.identifier,
		content: reqBody.content,
	}
	);

	return res
	.status(200)
	.json({ success: true, message: "Cms Updated Successfully" });
} catch (err) {

	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
/**
 * Check Forgot Password
 * METHOD : POST
 * URL : /api/forgotPassword
 * BODY : email
 */
export const checkForgotPassword = (req, res) => {
let reqBody = req.body;
Admin.findOne(
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
		confirmMailUrl: `${config.siteUrl}/change-password/${userData._id}`,
	};
	// console.log("User_forgot", userData.email, content);
	mailTemplate("User_forgot", userData.email, content);
	return res.status(200).json({ success: true });
	}
);
};


var storagekyc = multer.diskStorage({
destination: function (req, file, cb) {
	cb(null, "public/images");
},
filename: function (req, file, cb) {
	cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
},
});

var upload = multer({
storage: storagekyc, fileFilter: function (req, file, cb) {
	checkFileType(file, cb)
}
}).fields([
{ name: "photo", maxCount: 1, }
]);


function checkFileType(file, cb) {
const fileType = /jpeg|jpg|png|gif/;
const extname = fileType.test(path.extname(file.originalname).toLocaleLowerCase());
const mimetype = fileType.test(file.mimetype);
if (mimetype && extname) {
	cb(null, true)
} else {
	cb('Allow image  only');
}
}
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
{ name: "Photofile", maxCount: 1 }
]);

export const adduser = (req, res, next) => {
//console.log(req.user.id,"-----------------------------------------------------------");
const errors = {};
upload1(req, res, (err) => {
	if (err) {
	console.log("err", err);
	errors.photo = err
	res
		.status(400)
		.json({ success: false, "errors": errors });
	} else {
	return next();
	}
});
}

// export const adminaccept = (req, res) => {
//   console.log(req.body, "==================================")
//   Transaction.findOne({ "_id": req.body.id }).exec(function (err, rest) {
//     if (rest) {
//       var header = { "Content-Type": "application/json" };
//       var depositAmount = parseFloat(rest.amount) - parseFloat(rest.adminfees);
//       var args = { amount: depositAmount, address: rest.toaddress, type: "sendtoaddress" };
//       const options = {
//         url: config.svrserver + "BTCnode",
//         method: "POST",
//         headers: header,
//         body: JSON.stringify(args),
//       };
//       request(options, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//           const info = JSON.parse(body);
//           var resultjson = info.result;
//           console.log(resultjson, "resultjson====");
//           if (resultjson != "") {
//             Transaction.findOneAndUpdate({ "_id": req.body.id }, { "$set": { "status": 2, "transactionId": resultjson } }).exec(function async(er, resp) {

//               // User.findOneAndUpdate(
//               //   { addressbtc : rest.toaddress },
//               //   {
//               //     $inc: {
//               //       userBalance: -depositAmount,
//               //     },
//               //   }
//               // );
//               res.send({ "status": true, message: "success" });
//             })

//             //})
//           } else {
//             res.send({ "status": false, message: "failed" });
//           }
//         }
//       })
//     }
//   })
// }

// export const adminreject = (req, res) => {
//   console.log("cancel");
//   console.log(req.body, "req.body");
//   Transaction.findOneAndUpdate({ "_id": req.body.id }, { "status": 3 }).exec(async function (err, rest) {
//     console.log(rest, "restrest");
//     if (rest) {
//       var rejectedAMount = rest.amount;


//       var userBalance = await Tranaction.aggregate([
//         { '$match': { "userId": rest.userId } },
//         {
//           "$facet": {
//             "withdraw": [
//               { '$match': { "withdrawDeposit": 2, "$or": [{ "status": 1 }, { "status": 2 }] } },
//               { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
//             ],
//             "deposit": [
//               { '$match': { "withdrawDeposit": 1, "status": 1 } },
//               { "$group": { "_id": null, "amount": { "$sum": "$amount" } } }
//             ],
//           }
//         }
//       ]);
//       console.log(userBalance[0]);
//       var withdrawUser = 0;
//       if (userBalance[0].withdraw[0]) {
//         var withdrawUser = userBalance[0].withdraw[0].amount;
//       }

//       var DeositUser = 0;
//       if (userBalance[0].deposit[0]) {
//         var DeositUser = userBalance[0].deposit[0].amount;
//       }

//       var userBalanceuser = parseFloat(DeositUser) - parseFloat(withdrawUser);

//       console.log(withdrawUser, "withdrawUserwithdrawUserwithdrawUserwithdrawUserwithdrawUser");
//       console.log(DeositUser, "DeositUserDeositUserDeositUserDeositUserDeositUserDeositUser")
//       console.log(userBalanceuser, "userBalanceuseruserBalanceuseruserBalanceuseruserBalanceuser")

//       //reduce user balance
//       await User.findOneAndUpdate(
//         { _id: ObjectId(rest.userId) },
//         {
//           $set: {
//             userBalance: parseFloat(userBalanceuser),
//           },
//         },
//         { new: true },
//         function (selltemp_err, user) {
//           let content = {
//             name: user.name,
//           };
//           mailTemplate("Withdraw_Reject", user.email, content);
//           res.send({ "status": true, message: "success" });
//         }
//       );
//     } else {
//       res.send({ "status": false, message: err });
//     }
//   })
// }

export const updateProfile = (req, res, next) => {
	//console.log(req.user.id,"-----------------------------------------------------------");
	const errors = {}
	if(!req.photo)
	{
	  return next()
	}
	else
	{
	upload(req, res, (err) => {
	  if (err) {
		console.log(err);
		errors.photo = err
		res
		  .status(400)
		  .json({ success: false, "errors": errors });
	  } else {
		return next();
	  }
	});
  }
  }

export const getuserdata = async (req, res) => {
Admin.findOne({ _id: req.user.id }, (err, userData) => {
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

export const getpairdata = async (req, res) => {
Swappair.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, (err, userData) => {
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
export const gettokendata = async (req, res) => {
console.log("wyqteytwqyeteutwqeytwetwquteqwueqwue",req.params)
var Id = parseInt(req.params.id)
try{
var userData=await Token.aggregate([
	{
	$match:{
		"tokenCounts" : Id
	},
	},
	{
	$lookup:{
		from:'tokenowners',
		localField:'tokenCounts',
		foreignField:'tokenCounts',
		as:'tokenOwnerDb'
	}
	},
	{
			$unwind:{
				path:'$tokenOwnerDb',
				preserveNullAndEmptyArrays: true,
			
			}
	},
	{
	$project:{
		_id: 1,
		tokenPrice: 1,
		tokenCategory: 1,
		image: 1,
		tokenCounts: 1,
		tokenName: 1,
		tokenDesc: 1,
		tokenBid: 1,
		tokenOwner: 1,
		tokenCreator: 1,
		tokenRoyality: 1,
		status: 1,
		hashValue: 1,
		type: 1,
		balance: 1,
		tokenQuantity: 1,
		contractAddress: 1,
		minimumBid: 1,
		endclocktime: 1,
		clocktime: 1,
		likecount: 1,
		PutOnSale: 1,
		PutOnSaleType: 1,
		ipfsimage: 1,
		unlockcontent: 1,
		OnSaleOwner: 1,
		tokenOwnerDb:{
		tokenPrice:'$tokenOwnerDb.tokenPrice',
		tokenOwner:'$tokenOwnerDb.tokenOwner',
		balance:'$tokenOwnerDb.balance'
		}
	}
	}
	
])
console.log("SDasdasdasdas***************************",userData)
	return res
		.status(200)
		.json({ success: "true", userValue: userData });
	
	
}
	catch(e){
	console.log("SDasdasdasdas",e)
		return res
		.status(400)
		.json({ success: "fail", userValue: e });

	}


}

export const getcategorydata = async (req, res) => {
CategoryDet.find({ _id: new mongoose.Types.ObjectId(req.params.id) }).populate('categoryid').exec(function (err, userData) {
	var transaction = [];
	for (var i = 0; i < userData.length; i++) {
	transaction.push({
		// image:userData[i].image,
		// createdAt:userData[i].createdAt,
		name: userData[i].categoryid.name,
		id: userData[i]._id

	})
	}
	if (err) {
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: transaction, userData });
});
}

export const getadmintransaction = async (req, res) => {
Admintransaction.find({ withdrawDeposit: 1 }, (err, userData) => {
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

export const getadminwithdraw = async (req, res) => {
Admintransaction.find({ withdrawDeposit: 2 }, (err, userData) => {
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


export const getsettdata = async (req, res) => {
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


// export const updateWithdraw = async (req, res) => {
//   try {
//     let reqBody = req.body;
//     let check2Fa = node2fa.verifyToken(reqBody.secret, reqBody.otp);
//     if (check2Fa == null) {
//       return res
//         .status(500)
//         .json({ success: false, errors: { otp: "Ivalida code" } });
//     }
//     console.log(reqBody, "reqBodyreqBody");
//     var data = new Admintransaction({
//       "withdrawAddress": reqBody.address,
//       "amount": parseFloat(reqBody.amount),
//       "withdrawDeposit": 2,
//       "status": 0,
//     });

//     data.save(async function (err, rest) {
//       //console.log(err);
//       var header = { "Content-Type": "application/json" };
//       var args = { amount: parseFloat(rest.amount), address: rest.withdrawAddress, type: "sendtoaddress" };
//       console.log(args, "argsargsargsargsargsargsargs")
//       const options = {
//         url: config.svrserver + "BTCnode",
//         method: "POST",
//         headers: header,
//         body: JSON.stringify(args),
//       };
//       await request(options, async function (error, response, body) {
//         //console.log(response,"==============================================")
//         if (!error && response.statusCode == 200) {
//           const info = JSON.parse(body);
//           var resultjson = info.result;
//           console.log(resultjson, "sadsadsad");
//           if (resultjson != "") {
//             // console.log();
//             await Admintransaction.findOneAndUpdate({ "_id": rest._id }, { "$set": { "status": 2, "transactionId": resultjson } }).exec(function async(er, resp) {
//               // console.log(er,"saranUpdate--------------------------------------------")
//               res.send({ "status": true, message: "success" });
//             })
//           } else {
//             return res
//               .status(200)
//               .json({ success: false, errors: { otp: "Withdraw not successfull  please check the data" } });

//           }
//         }
//       })
//     });
//   } catch (err) {
//     console.log("----err2", err)
//     return res
//       .status(500)
//       .json({ success: false, errors: { messages: "Error on server" } });
//   }
// }

export const get2faadmin = async (req, res) => {
Settings.findOne({}, (err, userData) => {

	var result = {
	imageUrl: config.node2Fa.qrImage + userData.google2Fa.uri,
	secret: userData.google2Fa.secret
	}

	if (err) {
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: result });
});
}



export const getfaq = async (req, res) => {

Faq.findOne({ _id: req.params.id, deleted: 1 }, (err, userData) => {
	if (err) {
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
})
}

export const getmicrodata = async (req,res) => {
	console.log('reqqqq>>>>',req.params.id);
	Microownership.findOne({ tokenCount: req.params.id}, (err, microData) => {
		if (err) {
		return res
			.status(200)
			.json({ success: false, errors: { messages: "Error on server" } });
		}
	
		return res
			.status(200)
			.json({ success: true, microValue: microData });
	})
} 

export const getcms1 = async (req, res) => {

cmsnew.findOne({ _id: req.params.id}, (err, userData) => {
	if (err) {
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
})
}
export const getfaqlist = async (req, res) => {
var ser = req.query.search
var cond = { deleted: 1 };
if (ser) {
	cond = {
	deleted: 1,
	$or: [
		{ 'question': { $regex: '.*' + ser + '.*' } }
	]
	}
}
console.log(cond);
Faq.find(cond, (err, userData) => {
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

export const getMicroownershipList = async (req, res) => {
try {
	var data = await Microownership.aggregate([
	{
		$sort : { timestamp : -1 }
	},
	{
		$lookup : {
			from : 'tokenowners',
			localField : 'tokenCount',
			foreignField : 'tokenCounts',
			as : 'tokenOwners'
		} 
	},
	{
		$unwind: {
		  path: '$tokenOwners',
		  preserveNullAndEmptyArrays: true,
		}
	},
	{
		$match : {
			$and : [
				{ 'tokenOwners.balance' : { $ne : 0 } }
			]
		}
	},
	])
	if (!isEmpty(data)) {
	return res
		.status(200)
		.json({ success: true, list :  data});
	
	}
}catch(error) {
	return res
	.status(200)
	.json({ success: false, errors: { messages: "Error on server" } });


}
}
export const getCMSlist1 = async (req, res) => {
var val = await cmsnew.find({})
console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=",val)
if(val==null){
return res
.status(200)
.json({ success: false, errors: { messages: "Error on server" } });

}
else{
return res
.status(200)
.json({ success: true, userValue: val });

}}

export const getdepositlist = async (req, res) => {

var ser = req.query.search
console.log(ser, "serserser");
var cond = { $regex: '.*.*' };

if (ser) {
	cond = { $regex: '.*' + ser + '.*' }
}

Transaction.aggregate([
	{ $match: { "transactionType": "Deposit", "withdrawDeposit": 1, "status": 1 } },
	{
	$lookup:
	{
		from: "users",
		localField: "userId",
		foreignField: "_id",
		as: "user"
	}
	},
	{ "$unwind": "$user" },
	{ "$match": { "user.name": cond } }

], (err, userData) => {
	console.log(ser);
	//console.log(userData,"userDatauserDatauserDatauserData");
	if (err) {
	console.log(err, "errerrerrerrerrerrerr")
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
});
}

export const getwithdrawlist = async (req, res) => {

var ser = req.query.search
var cond = { "withdrawDeposit": 2, "transactionType": "Withdraw" }
if (ser) {
	cond = { "withdrawDeposit": 2, "transactionType": "Withdraw", 'amount': ser }
}

Transaction.aggregate([
	{ $match: cond },
	{
	$lookup:
	{
		from: "users",
		localField: "userId",
		foreignField: "_id",
		as: "user"
	}
	},
	{ "$unwind": "$user" },

]).exec(function (err, userData) {
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

export const getuserlist = async (req, res) => {
var ser = req.query.search
var cond = { deleted: 1 };
if (ser) {
	cond = {
	deleted: 1,
	$or: [
		{ 'name': { $regex: '.*' + ser + '.*' } },
		// {'phonenumber':{ $regex: '.*' + ser + '.*' }},
		// {'userid': ser},
		// {'userBalance':ser},
		// {'plan':ser},
		// {'email':{ $regex: '.*' + ser + '.*' }},
		// {'country':{ $regex: '.*' + ser + '.*' }},
	]
	}
}
console.log(cond);
User.find(cond, (err, userData) => {
	if (err) {
	console.log(err);
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
});
}

export const getpairlist = async (req, res) => {

Swappair.find({ deleted: 1 }, (err, userData) => {
	if (err) {
	console.log(err);
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
});
}
export const getBidslist = async (req, res) => {

Bids.find({deleted: 1 }, (err, userData) => {
	console.log("getBidslist",userData)
	if (err) {
	console.log(err);
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
});
}
export const getcatory = async (req, res) => {

Category.find({ deleted: 1 }, (err, userData) => {
	if (err) {
	console.log(err);
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
});
}
export const gettoken = async (req, res) => {

Token.find({ deleted: 1 }, (err, userData) => {
	var transaction = [];
	for (var i = 0; i < userData.length; i++) {
	transaction.push({
		name: userData[i].name,
		id: userData[i]._id
	})
	}
	if (err) {
	console.log(err);
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: transaction });
});
}
export const gettokenlist = async (req, res) => {
try{
var userData=await Token.aggregate([

	{
	$lookup:{
		from:'tokenOwner',
		localField:'tokenOwner',
		foreignField:'tokenOwner',
		as:'tokenOwnerDb'
	}
},
{
	$unwind:{
		path:'$tokenOwnerDb',
		preserveNullAndEmptyArrays: true,
	}
},
{
	$project:{
	_id: 1,
	tokenPrice: 1,
	tokenCategory: 1,
	image: 1,
	tokenCounts: 1,
	tokenName: 1,
	tokenDesc: 1,
	tokenBid: 1,
	tokenOwner: 1,
	tokenCreator: 1,
	tokenRoyality: 1,
	status: 1,
	hashValue: 1,
	type: 1,
	balance: 1,
	tokenQuantity: 1,
	contractAddress: 1,
	minimumBid: 1,
	endclocktime: 1,
	clocktime: 1,
	likecount: 1,
	PutOnSale: 1,
	PutOnSaleType: 1,
	ipfsimage: 1,
	unlockcontent: 1,
	OnSaleOwner: 1,
	tokenOwnerDb:{
		tokenPrice:'$tokenOwnerDb.tokenPrice',
		tokenOwner:'$tokenOwnerDb.tokenOwner',
		balance:'$tokenOwnerDb.balance'
	}

	}
}

])
console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",userData)
	return res
	.status(200)
	.json({ success: true, userValue: userData });

}
catch(e){
	console.log("SDasdasdasdas",e)
		return res
	.status(400)
	.json({ success: "fail", userValue: e });

}

}


export const getcatorylist = async (req, res) => {

Category.find({ deleted: 1 }).exec(function (err, userData) {

	// var transaction = [];
	// for (var i = 0; i < userData.length; i++) {
	//   transaction.push({
	//     image: userData[i].image,
	//     createdAt: userData[i].createdAt,
	//     name: userData[i].categoryid.name,
	//     id: userData[i]._id

	//   })
	// }
	if (err) {
	console.log(err);
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}
	console.log(userData)
	return res
	.status(200)
	.json({ success: true, userValue: userData });
});
}



export const stautuchange = async (req, res) => {
console.log(req.params.id, "deleteUser ")
try {
	let deleteuser = await Transaction.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { status: req.body.status }, { new: true });
	console.log(deleteuser);
	return res
	.status(200)
	.json({ success: true, message: "status Updated Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}


export const deleteuser = async (req, res) => {
console.log(req.params.id, "deleteUser ")
try {
	let deleteuser = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, { deleted: 0 }, { new: true });
	console.log(deleteuser);
	return res
	.status(200)
	.json({ success: true, message: "Profile Updated Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}

export const deletebids = async (req, res) => {
console.log(req.params.id, "deleteUser ")
try {
	let deleteuser = await Bids.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, { deleted: 0 }, { new: true });
	console.log(deleteuser);
	return res
	.status(200)
	.json({ success: true, message: "Profile Updated Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}

export const deletepair = async (req, res) => {
try {
	let deletepair = await Swappair.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, { deleted: 0 }, { new: true });
	console.log(deletepair);
	return res
	.status(200)
	.json({ success: true, message: "Profile Updated Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}

export const deletecategory = async (req, res) => {

try {
	let deletecategory = await Category.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, { deleted: 0 }, { new: true });

	return res
	.status(200)
	.json({ success: true, message: "Profile Updated Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}

//added


export const deleteToken = async (req, res) => {
console.log(req.params.id, "deletepair ")
try {
	let deleteToken = await Token.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, { deleted: 0 }, { new: true });

	return res
	.status(200)
	.json({ success: true, message: "Profile Updated Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}

// export const updatepair = async (req, res) => {

// }
export const ViewToken = async (req, res) => {
try {

	// var reqBody = req.params.id;
	// console.log("View Token" + reqBody)
	// let checkUser1 = await Token.findOne({ "_id": new mongoose.Types.ObjectId(reqBody) });
	// console.log(checkUser1);
	var userData=await Token.aggregate([
	{
		$match:{
		_id:req.params._id

		},
	},
		{
		$lookup:{
		from:'tokenOwner',
		localField:'tokenOwner',
		foreignField:'tokenOwner',
		as:'tokenOwnerDb'
		}
	},
	{
		$unwind:{
		path:'$tokenOwnerDb',
		preserveNullAndEmptyArrays: true,
		
		}
	},
	{
		$project:{
		_id: 1,
		tokenPrice: 1,
		tokenCategory: 1,
		image: 1,
		tokenCounts: 1,
		tokenName: 1,
		tokenDesc: 1,
		tokenBid: 1,
		tokenOwner: 1,
		tokenCreator: 1,
		tokenRoyality: 1,
		status: 1,
		hashValue: 1,
		type: 1,
		balance: 1,
		tokenQuantity: 1,
		contractAddress: 1,
		minimumBid: 1,
		endclocktime: 1,
		clocktime: 1,
		likecount: 1,
		PutOnSale: 1,
		PutOnSaleType: 1,
		ipfsimage: 1,
		unlockcontent: 1,
		OnSaleOwner: 1,
		tokenOwnerDb:{
			tokenPrice:'$tokenOwnerDb.tokenPrice',
			tokenOwner:'$tokenOwnerDb.tokenOwner',
			balance:'$tokenOwnerDb.balance'
		}
	
		}
	}
	
	])

	return res
	.status(200)
	.json({ success: true, message: "Pair Updated Successfully", userData });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}

// var categorySlog = req.params.category;
// adminCategories.findOne({ slog: categorySlog }, function (err, c) {
//   Product.find({ category: categorySlog }, function (err, product) {
//     if (err)
//       console.log("cant find" + err);

//     res.render('login', {
//       message: req.flash('info'),
//       // p_id: _id,
//       // title: c.title,
//       product: product
//     });
//     console.log("category slog:" + categorySlog)
//   });
export const getExplore = async (req, res) => {
try {
	var reqBody = req.params.id;
	console.log("View Token" + reqBody)
	await Category.findOne({ "_id": new mongoose.Types.ObjectId(reqBody) }, async (err, data) => {
	await Token.find({ "categoryid": new mongoose.Types.ObjectId(reqBody) })
	})
	return res
	.status(200)
	.json({ success: true, message: "Pair Updated Successfully", checkUser1 });
}
catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
///
export const getCmsList = async (req, res) => {

const cmsData = await Cms.find({});
return res
	.status(200)
	.json({ success: true, cmsData: cmsData });

}

export const deletefaq = async (req, res) => {
console.log(req.params.id, "deleteUser ")
try {
	let deleteuser = await Faq.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, { deleted: 0 }, { new: true });
	console.log(deleteuser);
	return res
	.status(200)
	.json({ success: true, message: "Faq Deleted Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}

export const updatepair = async (req, res) => {
try {
	var reqBody = req.body;

	let checkUser1 = await Swappair.findOne({ "_id": new mongoose.Types.ObjectId(reqBody.userId) });

	console.log(checkUser1);
	var test = await Swappair.findOneAndUpdate(
	{ _id: new mongoose.Types.ObjectId(reqBody.userId) },
	{
		name: reqBody.name,
	}
	);
	return res
	.status(200)
	.json({ success: true, message: "Pair Updated Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
export const updatecategory = async (req, res) => {
try {
	var reqBody = req.body;
	console.log("updatecategory", req.files)
	console.log("reqBody", reqBody)

	let checkUser1 = await CategoryDet.findOne({ "_id": new mongoose.Types.ObjectId(reqBody.userId) });
	if (req.files != undefined) {

	var test = await CategoryDet.findOneAndUpdate(
		{ _id: new mongoose.Types.ObjectId(reqBody.userId) },
		{
		categoryid: reqBody.name,
		image: req.files.Photofile[0].filename,

		}
	);
	} else {
	var test = await Category.findOneAndUpdate(
		{ _id: new mongoose.Types.ObjectId(reqBody.userId) },
		{
		categoryid: reqBody.name,
		image: checkUser1.image,

		}
	);
	}

	return res
	.status(200)
	.json({ success: true, message: "Category Updated Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}


export const updateuser = async (req, res) => {
try {
	var reqBody = req.body;
	// console.log(req.body,"fghfghfghfghfghfghfghfghfghfghfghfghfghfghfgh");
	let checkUser = await User.findOne({ "email": reqBody.email, "deleted": 1, "_id": { "$ne": new mongoose.Types.ObjectId(reqBody.userId) } });
	let checkphoneNumber = await User.findOne({ "phonenumber": reqBody.phonenumber, "deleted": 1, "_id": { "$ne": new mongoose.Types.ObjectId(reqBody.userId) } })
	if (checkUser) {
	if (checkUser.email == reqBody.email) {
		return res.status(400).json({ "success": false, 'errors': { 'email': "Email already exists" } })
	}
	} if (checkphoneNumber) {
	if (checkphoneNumber.phonenumber == reqBody.phonenumber) {
		return res.status(400).json({ "success": false, 'errors': { 'phonenumber': "Phone Number already exists" } })

	}
	}

	let checkUser1 = await User.findOne({ "_id": new mongoose.Types.ObjectId(reqBody.userId) });

	console.log(checkUser1);
	var test = await User.findOneAndUpdate(
	{ _id: new mongoose.Types.ObjectId(reqBody.userId) },
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
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}

export const updateSettings = async (req, res) => {
try {
	var reqBody = req.body;
	console.log(reqBody);
	var data = await Settings.findOne();
	if(data){
	var test = await Settings.findOneAndUpdate(
		{},
		{
		
		Website:reqBody.Website,
		Instagram:reqBody.Instagram,
		Twitter:reqBody.Twitter,
		Telegram:reqBody.Telegram,
		Reddit:reqBody.Reddit,
		Discord:reqBody.Discord,
		fields : reqBody.fields
	
		}
	);
	}
	else{
	var linksave = new Settings({
		Website: reqBody.Website,
		Instagram: reqBody.Instagram,
		Twitter: reqBody.Twitter,
		Telegram: reqBody.Telegram,
		Reddit: reqBody.Reddit,
		Discord: reqBody.Discord,
		fields : reqBody.fields
	})
	let newDoc = await linksave.save();
	}

	return res
	.status(200)
	.json({ success: true, message: "Settings Updated Successfully" });
} catch (err) {
	// console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
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
  
	  console.log(checkUser);
	  var test = await Admin.findOneAndUpdate(
		{ _id: req.user.id },
		{
		  name: req.body.name,
		  email: req.body.email,
		  phoneNo: req.body.mobilenumber,
		  designation: req.body.designation,
		  about: req.body.detail,
		  company: req.body.company,
		  address: req.body.address
		  //profileImage: req.files.photo ? req.files.photo[0].filename : checkUser1.profileImage,
		}
	  );
	  return res
		.status(200)
		.json({ success: true, message: "Profile Updated Successfully" });
	} catch (err) {
	  console.log("----err", err)
	  return res
		.status(500)
		.json({ success: false, errors: { messages: "Error on server" } });
	}
  }

export const addfaq = async (req, res) => {
console.log("dfjshfkjshfjkhsdjkfhjksdhfjkshdjkfhsjkdfhjksdhfjksdhfjksdhfjk");
try {
	var reqBody = req.body;

	let checkUser = await Faq.findOne({ "question": reqBody.question, "deleted": 1 });

	if (checkUser) {
	if (checkUser.question == reqBody.question) {
		return res.status(400).json({ "success": false, 'errors': { 'question': "Question already exists" } })
	}
	}
	//console.log(checkUser);

	let newUserData = new Faq({
	"question": reqBody.question,
	"answer": reqBody.answer,
	});

	let newDoc = await newUserData.save();
	return res
	.status(200)
	.json({ success: true, message: "Faq Updated Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}

export const useradd = async (req, res) => {
console.log(req.body, "kkkkkkkkkkkkkkkkkk")
try {
	var reqBody = req.body;
	let checkUser = await User.findOne({ "email": reqBody.email, "deleted": 1 });
	let checkphoneNumber = await User.findOne({ "phonenumber": reqBody.phonenumber, "deleted": 1 })
	if (checkUser) {
	if (checkUser.email == reqBody.email) {
		return res.status(400).json({ "success": false, 'errors': { 'email': "Email already exists" } })
	}
	} if (checkphoneNumber) {
	if (checkphoneNumber.phonenumber == reqBody.phonenumber) {
		return res.status(400).json({ "success": false, 'errors': { 'phonenumber': "Phone Number already exists" } })

	}
	}
	var data = {
	email: reqBody.email,
	type: "getnewaddress",
	}
	//console.log(config);
	let respData = await axios({
	'method': 'post',
	'url': `${config.serverip.url}/btcnode`,
	data

	});
	var img = "";
	await QRCode.toDataURL(respData.data.result)
	.then(url => {
		img = url;

		//console.log(respData.data, "respdata");

		User.find({}, { userid: 1 }, { sort: { userid: -1 }, limit: 1 }).then(
		async (latesuser) => {
			//console.log('latestId',latesuser)
			var latestId = 1;
			if (
			latesuser && latesuser.length > 0 &&
			latesuser[0].userid &&
			latesuser[0].userid > 0
			) {
			latestId = parseInt(latesuser[0].userid) + parseInt(1);
			}
			var spnCode = 1;
			User.find({ userid: spnCode }).then(async (refrercode) => {
			console.log(refrercode);
			if (reqBody.Photofile == '') {
				let newUserData = new User({
				"name": reqBody.name,
				"email": reqBody.email,
				"phonenumber": reqBody.phonenumber,
				"address1": reqBody.address1,
				"address2": reqBody.address2,
				"pincode": reqBody.pincode,
				"city": reqBody.city,
				"country": reqBody.country,
				"Photofile": reqBody.Photofile,
				"userBalance": 0,
				"addressbtc": respData.data.result,
				"userid": latestId,
				"refid": refrercode[0]._id,
				"qrCode": img,
				});

				let newDoc = await newUserData.save();
			} else {
				let newUserData = new User({
				"name": reqBody.name,
				"email": reqBody.email,
				"phonenumber": reqBody.phonenumber,
				"address1": reqBody.address1,
				"address2": reqBody.address2,
				"pincode": reqBody.pincode,
				"city": reqBody.city,
				"country": reqBody.country,
				"Photofile": req.files.Photofile ? req.files.Photofile[0].filename : checkUser.Photofile,
				"userBalance": 0,
				"addressbtc": respData.data.result,
				"userid": latestId,
				"refid": refrercode[0]._id,
				"qrCode": img,
				});
			}
			//console.log(newUserData,"saranTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
			let newDoc = await newUserData.save();
			})
		})
	})

	return res
	.status(200)
	.json({ success: true, message: "Profile Updated Successfully" });
} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
/**
 * Change Password
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
 */
export const changeForgotPassword = async (req, res) => {
console.log(req.body, "sdfdsfdsfsdfdsfdsfsd");
try {
	let reqBody = req.body;

	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(reqBody.password, salt);
	console.log(hash);
	if (!hash) {
	return res
		.status(500)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	let userData = await Admin.findOne({ _id: reqBody.userId });
	if (!userData) {
	return res
		.status(500)
		.json({ success: false, errors: { messages: "User not found" } });
	}

	userData.password = hash;
	await userData.save();

	return res.status(200).json({ success: true });
} catch (err) {
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
};

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

	case "Withdraw_Reject":
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

	sendEmail(email, mailContent);

	return true;
} catch (err) {
	console.log(err);
	return false;
}
}

export const updatemicro = async (req, res) => {
		var reqBody = req.body;
		console.log('>>>>>>updatemicrotest',req.body);
		var microadminslot = new MicroBoolSlot({
			tokenCount : reqBody.tokenCount,
			buyerAddress : reqBody.adminAddress,
			buyerSlot : 1,
			claim : false
		});
		var bookingSlotdata = await microadminslot.save();

		var test = await Microownership.findOneAndUpdate(
		{ _id: new mongoose.Types.ObjectId(reqBody.id) },
		{
			price: reqBody.price,
			slot: reqBody.slot,
			availableSlot : reqBody.availableSlot,
			restrictSlot : reqBody.restrictSlot,
			bep20token : reqBody.bep20
		}
		);
		console.log(test, "dfdsfdsfdsf12334543534535654654656756");
		if (test)
			return res
			.status(200)
			.json({ success: true, message: "Micro Updated Successfully" });
		else 
			return res
			.status(200)
			.json({ success: false, message: "Micro Updated Failed" });
}
export const updatefaq = async (req, res) => {
try {
	var reqBody = req.body;
	let checkUser = await Faq.findOne({ "question": reqBody.question, "deleted": 1});
	if (checkUser) {
	if (checkUser.question == reqBody.question) {
		return res.status(400).json({ "success": false, 'errors': { 'question': "Question already exists" } })
	}
	}
	var test = await Faq.findOneAndUpdate(
	{ _id: new mongoose.Types.ObjectId(reqBody.faqId) },
	{
		question: reqBody.question,
		answer: reqBody.answer,
	}
	);
	console.log(test, "dfdsfdsfdsf12334543534535654654656756");
	return res
	.status(200)
	.json({ success: true, message: "Faq Updated Successfully" });
} catch (err) {
	console.log(err, "dfdsfdsfdsf12334543534535654654656756");
	console.log(err);
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on serversssssss" } });
}
}

export const getwithdrawdaily = async (req, res) => {
var d = new Date();
var date = d.getDate();
var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getFullYear();
var todate = year + "-" + month + "-" + date;
console.log(todate, "today");

Transaction.find({ "createdAt": { $gte: moment(new Date(todate)).format() }, "withdrawDeposit": 2, "status": 1, "transactionType": "Withdraw" }).populate('userId').exec(function (err, user) {
	return res
	.status(200)
	.json({ success: true, userValue: user });
});


}

export const getdepositdaily = async (req, res) => {
var d = new Date();
var date = d.getDate();
var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getFullYear();
var todate = year + "-" + month + "-" + date;
console.log(todate, "today");

Transaction.aggregate([
	{ $match: { "createdAt": { $gte: moment(new Date(todate)).format() }, "transactionType": "Deposit", "withdrawDeposit": 1, "status": 1 } },
	{
	$lookup:
	{
		from: "users",
		localField: "userId",
		foreignField: "_id",
		as: "user"
	}
	},
	{ "$unwind": "$user" }

], (err, userData) => {
	console.log(userData, "userDatauserDatauserDatauserData");
	if (err) {
	console.log(err, "errerrerrerrerrerrerr")
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
});


}

export const getuserdaily = async (req, res) => {
var d = new Date();
var date = d.getDate();
var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getFullYear();
var todate = year + "-" + month + "-" + date;
console.log(todate, "today");

User.find({ "date": { $gte: moment(new Date(todate)).format() } }).populate('refid').populate('referaluserid').exec(function (err, user) {
	return res
	.status(200)
	.json({ success: true, userValue: user });
});


}

export const getusercustom = async (req, res) => {
var enddate = req.body.enddate;
var startdate = req.body.startdate;

User.find({ "date": { $lte: moment(new Date(enddate)).format(), $gte: moment(new Date(startdate)).format() } }).populate('refid').populate('referaluserid').exec(function (err, user) {
	console.log(user, "================================")
	return res
	.status(200)
	.json({ success: true, userValue: user });
});

}

// export const getBalance = async (req, res) => {

//   var header = { "Content-Type": "application/json" };
//   var args = { type: "getbalanceAll" };
//   const options = {
//     url: config.svrserver + "BTCnode",
//     method: "POST",
//     headers: header,
//     body: JSON.stringify(args),
//   };
//   request(options, function (error, response, body) {
//     //console.log(response,"==============================================")
//     //console.log(error,"==============================================")
//     if (!error && response.statusCode == 200) {
//       const info = JSON.parse(body);
//       var resultjson = info.result;
//       return res.status(200).json({ success: true, userValue: resultjson });
//     }
//   })

// }



// export const getcount = async (req, res) => {
//   await User.find({}).count().exec(async function (err, user) {
//     await Transaction.find({ "withdrawDeposit": 2, "status": 2, "transactionType": "Withdraw" }).count().exec(async function (err, withdr) {
//       await Transaction.find({ "transactionType": "Deposit", "withdrawDeposit": 1, "status": 1 }).count().exec(async function (err, dep) {
//         await Transaction.find({}).count().exec(async function (err, trans) {
//           await Transaction.find({ "transactionType": "Referal" }).count().exec(async function (err, ref) {
//             await Transaction.find({ "transactionType": "Purchase" }).count().exec(async function (err, pur) {
//               await Transaction.find({ "withdrawDeposit": 2, "status": 1, "transactionType": "Withdraw" }).count().exec(async function (err, adminpen) {
//                 await Transaction.find({ "withdrawDeposit": 2, "status": 2, "transactionType": "Withdraw" }).count().exec(async function (err, adminapp) {
//                   await Transaction.aggregate([{
//                     $group: {
//                       _id: null,
//                       fees: { $sum: "$adminfees" }
//                     }
//                   }]).exec(async function (err, adminfees) {
//                     var adfees = 0;
//                     if (adminfees && adminfees[0] && adminfees[0].fees) {
//                       var adfees = adminfees[0].fees;
//                     }

//                     //console.log(config.svrserver);
//                     var header = { "Content-Type": "application/json" };
//                     var args = { type: "getbalanceAll" };
//                     const options = {
//                       url: config.svrserver + "BTCnode",
//                       method: "POST",
//                       headers: header,
//                       body: JSON.stringify(args),
//                     };
//                     request(options, function (error, response, body) {
//                       //console.log(response,"==============================================")
//                       //console.log(error,"==============================================")
//                       if (!error && response.statusCode == 200) {
//                         const info = JSON.parse(body);
//                         var resultjson = info.result;
//                         //console.log(resultjson,"resultjson");

//                         var data = {
//                           user,
//                           withdr,
//                           dep,
//                           trans,
//                           ref,
//                           pur,
//                           adminapp,
//                           adminpen,
//                           resultjson,
//                           adfees
//                         }
//                         return res.status(200).json({ success: true, userValue: data });
//                       }
//                     })
//                   })
//                 })
//               })
//             })
//           })
//         })
//       })
//     })
//   })
// }

export const getdepositcustom = async (req, res) => {
var enddate = req.body.enddate;
var startdate = req.body.startdate;

Transaction.find({ "createdAt": { $lte: moment(new Date(enddate)).format(), $gte: moment(new Date(startdate)).format() }, "transactionType": "Deposit", "withdrawDeposit": 1, "status": 1 }).populate('userId').exec(function (err, user) {
	console.log(user, "================================")
	return res
	.status(200)
	.json({ success: true, userValue: user });
});

}

export const getwithdrawcustom = async (req, res) => {
var enddate = req.body.enddate;
var startdate = req.body.startdate;

Transaction.find({ "createdAt": { $lte: moment(new Date(enddate)).format(), $gte: moment(new Date(startdate)).format() }, "withdrawDeposit": 2, "status": 1, "transactionType": "Withdraw" }).populate('userId').exec(function (err, user) {
	console.log(user, "================================")
	return res
	.status(200)
	.json({ success: true, userValue: user });
});

}

export const getdepositmonthly = async (req, res) => {
//console.log("saran");
var enddate = "";
var startdate = "";
var d = new Date();
var date = d.getDate();
var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getFullYear();
var todate = year + "-" + month + "-" + date;
console.log(todate, "today");
var mon = ""
if (month == 1) {
	mon = "jan";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 2) {
	mon = "feb";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 3) {
	mon = "mar";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 4) {
	mon = "apr";
	startdate = year + "-" + mont + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 6) {
	mon = "jun";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 7) {
	mon = "jul";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 8) {
	mon = "aug";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 9) {
	mon = "sep";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 10) {
	mon = "oct";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 11) {
	mon = "nov";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 12) {
	mon = "dec";
	startdate = year + "-" + month + "-01";
	enddate = (parseInt(year) + 1) + "-01-01"
}
console.log({ "createdAt": { $lte: new Date(enddate), $gte: new Date(startdate) }, "transactionType": "Deposit", "withdrawDeposit": 1, "status": 1 });
Transaction.aggregate([
	{ $match: { "createdAt": { $lte: new Date(enddate), $gte: new Date(startdate) }, "transactionType": "Deposit", "withdrawDeposit": 1, "status": 1 } },
	{
	$lookup:
	{
		from: "users",
		localField: "userId",
		foreignField: "_id",
		as: "user"
	}
	},
	{ "$unwind": "$user" }

], (err, userData) => {
	console.log(userData, "userDatauserDatauserDatauserData");
	if (err) {
	console.log(err, "errerrerrerrerrerrerr")
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
});

// Transaction.find().populate('UserId').exec(function(err,user){
//   console.log(user,"useruseruseruser");
//   return res
//   .status(200)
//   .json({ success: true, userValue: user });
// });


}

export const getwithdrawmonthly = async (req, res) => {
var enddate = "";
var startdate = "";
var d = new Date();
var date = d.getDate();
var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getFullYear();
var todate = year + "-" + month + "-" + date;
console.log(todate, "today");
var mon = ""
if (month == 1) {
	mon = "jan";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 2) {
	mon = "feb";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 3) {
	mon = "mar";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 4) {
	mon = "apr";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 5) {
	mon = "may";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 6) {
	mon = "jun";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 7) {
	mon = "jul";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 8) {
	mon = "aug";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 9) {
	mon = "sep";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 10) {
	mon = "oct";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 11) {
	mon = "nov";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 12) {
	mon = "dec";
	startdate = year + "-" + month + "-01";
	enddate = (parseInt(year) + 1) + "-01-01"
}
Transaction.aggregate([
	{ $match: { "createdAt": { $lte: new Date(enddate), $gte: new Date(startdate) }, "withdrawDeposit": 2, "status": 1, "transactionType": "Withdraw" } },
	{
	$lookup:
	{
		from: "users",
		localField: "userId",
		foreignField: "_id",
		as: "user"
	}
	},
	{ "$unwind": "$user" }

], (err, userData) => {
	console.log(userData, "userDatauserDatauserDatauserData");
	if (err) {
	console.log(err, "errerrerrerrerrerrerr")
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
});
// Transaction.find({"createdAt":{$lte:moment(new Date(enddate)).format(),$gte: moment(new Date(startdate)).format()},"withdrawDeposit" : 2, "status" : 1, "transactionType" : "Withdraw"}).populate('UserId').exec(function(err,user){
//   return res
//   .status(200)
//   .json({ success: true, userValue: user });
// });


}

export const getusermonthly = async (req, res) => {
var enddate = "";
var startdate = "";
var d = new Date();
var date = d.getDate();
var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getFullYear();
var todate = year + "-" + month + "-" + date;
console.log(todate, "today");
var mon = "";
if (month == 1) {
	mon = "jan";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 2) {
	mon = "feb";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 3) {
	mon = "mar";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 4) {
	mon = "apr";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 5) {
	mon = "may";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 6) {
	mon = "jun";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 7) {
	mon = "jul";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 8) {
	mon = "aug";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 9) {
	mon = "sep";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 10) {
	mon = "oct";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 11) {
	mon = "nov";
	startdate = year + "-" + month + "-01";
	enddate = year + "-" + (parseInt(month) + parseInt(1)) + "-01"
} else if (month == 12) {
	mon = "dec";
	startdate = year + "-" + month + "-01";
	enddate = (parseInt(year) + 1) + "-01-01"
}
User.find({ "date": { $lte: moment(new Date(enddate)).format(), $gte: moment(new Date(startdate)).format() } }).populate('refid').populate('referaluserid').exec(function (err, user) {
	return res
	.status(200)
	.json({ success: true, userValue: user });
});


}


export const getcms = async (req, res) => {

EmailTemplate.findOne({ _id: req.params.id }, (err, userData) => {
	if (err) {
	return res
		.status(200)
		.json({ success: false, errors: { messages: "Error on server" } });
	}

	return res
	.status(200)
	.json({ success: true, userValue: userData });
})
}


export const getcmslist = async (req, res) => {
EmailTemplate.find({}, (err, userData) => {
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


export const getuserlisttrans = async (req, res) => {

AllTransaction.find({}, (err, userData) => {
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

export const updatecms = async (req, res) => {
try {

	var reqBody = req.body;

	let checkUser = await EmailTemplate.findOne({ "subject": reqBody.subject, "_id": { "$ne": new mongoose.Types.ObjectId(reqBody.cmsId) } });

	if (checkUser) {
	if (checkUser.subject == reqBody.subject) {
		return res.status(400).json({ "success": false, 'errors': { 'subject': "subject already exists" } })
	}
	}

	var test = await EmailTemplate.findOneAndUpdate(
	{ _id: new mongoose.Types.ObjectId(reqBody.cmsId) },
	{
		subject: reqBody.subject,
		identifier: reqBody.identifier,
		content: reqBody.content,
	}
	);

	return res
	.status(200)
	.json({ success: true, message: "Email Template Updated Successfully" });
} catch (err) {

	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}

export const getcsvdata = async (req, res) => {
var userList = [];
await User.aggregate([
	{
	$lookup: {
		from: 'Transaction',
		let: { id: "$_id" },
		pipeline: [
		{
			$match:
			{
			$expr:
			{
				$eq: ["$userId", "$$id"]
			}
			}
		},
		{
			"$facet": {
			"depositcnt": [
				{ "$match": { "withdrawDeposit": 1, 'transactionType': 'Deposit', 'status': 1 } },
				{
				"$group": {
					"_id": null,
					"registered": { $sum: "$amount" }
				}
				},
			],
			"withdrawCnt": [
				{ "$match": { "withdrawDeposit": 2, 'transactionType': 'Withdraw', 'status': 2 } },
				{
				"$group": {
					"_id": null,
					"total": { "$sum": "$amount" }
				}
				},
			]
			}
		},
		],
		as: "transactionInfo"
	}
	},
	{
	$lookup: {
		from: 'users',
		let: { id: "$_id", },
		pipeline: [
		{
			$match:
			{
			$expr:
			{
				$eq: ["$refid", "$$id"]
			}
			}
		},
		{
			"$group": {
			"_id": null,
			"refCnt": { $sum: 1 }
			}
		},
		],
		as: "refInfo"
	}
	}
],
	async (err, data) => {
	if (err) {
		console.log("----err", err)
	} else {
		await data.map((dat, i) => {
		// console.log(dat,"gfgshafdhgafhgdfsghdfsaghdfghsafd--------------------------------------------------------");
		// userList.push({name:dat.name,balance:dat.userBalance,deposit: dat.transactionInfo.length>0 && dat.transactionInfo[0].depositcnt.length>0 ? dat.transactionInfo[0].depositcnt[0].registered:0,currentlevel:dat.plan,withdraw:0,refid:0});
		userList.push({
			name: dat.name,
			balance: dat.userBalance,
			deposit: dat && dat.transactionInfo && dat.transactionInfo.length > 0 && dat.transactionInfo[0].depositcnt && dat.transactionInfo[0].depositcnt[0] && dat.transactionInfo[0].depositcnt[0].registered ? dat.transactionInfo[0].depositcnt[0].registered : 0
			, currentlevel: dat.plan, withdraw: dat.transactionInfo && dat.transactionInfo.length > 0 && dat.transactionInfo[0].withdrawCnt.length > 0 ? dat.transactionInfo[0].withdrawCnt[0].total : 0, refid: dat && dat.refInfo && dat.refInfo.length > 0 ? dat.refInfo[0].refCnt : 0
		});

		})

		// console.log(userList,"userListuserListuserListuserListuserListuserList")
		return res
		.status(200)
		.json({ success: true, userValue: userList });

	}
	})

	
}
export const newsletter = async (req, res) => {
console.log("Newsletter")
const reqBody=req.body;

var subscribe = new Subscribe({
	email: reqBody.email,
	curraddress: reqBody.currAddr,
	})
	console.log("Email "+reqBody.emai)
	var data = await Subscribe.findOne({email: reqBody.email})
	if(data){
		console.log("Email. already exist")
		res.json({success: false, message: "Email already Excist"})

	}
	else{
		console.log("Email. Saved")
		subscribe.save()
		.then((data) => {
		var jsonfilter = {
			identifier: "Newsletter",
		};
		return res.status(200).json({ success: true, message: "Profile Updated Successfully" });
		})
		.catch((e) => {
		res.json({ "err ": e })
		})
		
	}
	
}
export const getSocialLink = async (req, res) => {
console.log("GetLink")
const socialData = await Settings.findOne({});

return res
	.status(200)
	.json({ success: true, userValue: socialData });

	
}

export const updateservicefee = async (req, res) => {
console.log("GetLink")
const data = await servicefee.findOne({});
console.log("asjdhjasgdgasdsagdjgsjhdgsgadjgjsds",data)
// var socialData=await servicefee.findOneAndUpdate({_id:data._id},{$set:{"servicefee":req.body.servicefee}});
if(data==null){
	var dats=new servicefee({
	servicefee:req.body.servicefee
	})
	dats.save();
}
else{
	var socialData=await servicefee.findOneAndUpdate({_id:data._id},{$set:{"servicefee":req.body.servicefee}});

}

// return res
//   .status(200)
//   .json({ success: true, userValue: socialData });     
}



export const updateservicefeeget = async (req, res) => {
console.log("GetLink")
const socialData = await servicefee.findOne({});

return res
	.status(200)
	.json({ success: true, userValue: socialData });     
}

export const getPrivacyVal = async (req, res) => {
console.log("GetLink",req.body)
var question=req.body.location;
const socialData = await cmsnew.findOne({"question":question});
console.log("dshadhasgdgasgdhasgdgasdashdahs",socialData)
return res
	.status(200)
	.json({ success: true, userValue: socialData });
}


export const updatecms1 = async (req, res) => {
console.log("reqbody",req.body);
try {
	var reqBody = req.body;
	let checkUser = await cmsnew.findOne({"question": reqBody.question});
	console.log("checkuser",checkUser)
	if (checkUser) {
	if (checkUser.question == reqBody.question) {
		let checkUser1 = await cmsnew.findOneAndUpdate({ "question": reqBody.question},
		{"$set":{"answer":reqBody.answer}},
		{new:true});
		console.log("CheckUser1",checkUser1)
		res.json({userValue:checkUser1})
	}
	}
	//console.log(checkUser);

} catch (err) {
	console.log("----err", err)
	return res
	.status(500)
	.json({ success: false, errors: { messages: "Error on server" } });
}
}
export const getAdminData = async (req,res) => {
	try {
		var adminPostData = await Admin.find( { currAddress : req.body.currAddr } )
		console.log('getAdminData',adminPostData);
		if (!isEmpty(adminPostData)) {
			return res
				.status(200)
				.json({ success: true, userValue: adminPostData.shift() });
			
		}else {
			return res
					.status(200)
					.json({ success: false, errors: { messages: "No data found" } });
		}
	}catch(error) {
		return res
		.status(500)
		.json({ success: false, errors: { messages: "Error on server" } });
	}
}
export const updateAdmin = async (req, res) => {
	try {
		var reqBody = req.body;
		console.log('updateAdmin>>>>',reqBody)
		let salt = bcrypt.genSaltSync(10);
		let hash = bcrypt.hashSync(reqBody.password, salt);
		console.log(hash);
		var data = await Admin.findOneAndUpdate(
			{  currAddress : reqBody.currAddress}, 
			{  "$set" : { name : reqBody.name , email : reqBody.email , phoneNo : reqBody.mobilenumber, designation: reqBody.designation, password : hash, normalPassword : reqBody.password, company : reqBody.company}},
			{  new : true } );
		if(data) {
			return res
			.status(200)
			.json({ success: true, userValue: data });
		}
	}catch(error) {
		console.log('catcherror>>>>',error);
		return res
			.status(500)
			.json({ success: false, error: 'error found' });
	}
}