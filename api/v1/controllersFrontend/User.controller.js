import e from 'express';
import fs from 'fs'
import path from 'path'
import mongoose, {now} from 'mongoose';
var async = require('async');
// import web3 from 'web3'
// var Web3 = new web3(web3.givenProvider || 'wss://rinkeby-light.eth.linkpool.io/ws');

var syncEach = require('sync-each');

const ObjectId = mongoose.Types.ObjectId;

const Config = require(path.resolve('./config/config')).default;

const UserDb = require(path.resolve('./models/User'));
const FollowerDB = require(path.resolve('./models/follower'));
const MyItemAddrDb = require(path.resolve('./models/myItemAddr'));
const CategoryDb = require(path.resolve('./models/category'));
const TokenDb = require(path.resolve('./models/Token'));
const TokenOwnerDb = require(path.resolve('./models/TokenOwner'));
const LikeDb = require(path.resolve('./models/like'));
const ActivityDb = require(path.resolve('./models/activity'));
const FollowDb = require(path.resolve('./models/follow'));
const isEmpty = require(path.resolve('./config/isEmpty'));

const MongooseHelper = require('../helpers/mongoose-helper');
const ActivityHelper = require('../helpers/activity-helper');

export const UserUpdate = async (req, res) => {
var RetData = {};
RetData.details = {};
RetData.toast = {};
var ReqBody = req.body;
var addr = ReqBody.addr;
let UserDet = await UserDb.findOne({ "curraddress": addr });

if (UserDet != null) {
	var Resp = await UserDb.findOneAndUpdate(
	{ curraddress: addr },
	{ $set: {
		addr: ReqBody.currAddr,
		name: ReqBody.name,
		personalsite: ReqBody.personalsite,
		customurl: ReqBody.customurl,
		desccription: ReqBody.desccription,
	bio: ReqBody.bio,
		twitter: ReqBody.twitter,
		youtube: ReqBody.youtube,
		facebook: ReqBody.facebook,
		instagram: ReqBody.instagram,
	} },
	{ new: true }
	);
	if(Resp) {
		RetData.details = Resp;
		RetData.toast.type = 'success';
		RetData.toast.msg = 'User profile updated successfully';
	} else {
		RetData.toast.type = 'error';
		RetData.toast.msg = 'User profile not updated';
	}
	res.json(RetData);
} else {
	var NewUser = new UserDb({
	"name": ReqBody.name,
	"personalsite": ReqBody.personalsite,
	"customurl": ReqBody.customurl,
	"curraddress": addr
	})
	NewUser.save(async function (err, Resp) {
	if(Resp) {
		RetData.data = Resp;
		RetData.toast.type = 'success';
		RetData.toast.msg = 'User profile updated successfully';
	} else {
		RetData.toast.type = 'error';
		RetData.toast.msg = 'User profile not updated';
	}
	res.json(RetData);
	})
}
}

export const FollowChange = async (req, res) => {
var RetData = {};
var ReqBody = req.body;
var currAddr = ReqBody.currAddr;
var ParamAccountAddr = ReqBody.ParamAccountAddr;

var FindData = {};
FindData.follower = currAddr;
FindData.owner = ParamAccountAddr;

FollowDb.findOne(FindData)
.then(async (data) => {
	if(data == null) {
	var FollowNew = new FollowDb({
		"owner": ParamAccountAddr,
		"follower": currAddr
	})
	FollowNew.save();
	RetData.ChangeType = 'Follow';
	RetData.toast = {
		type: 'success',
		msg: 'Follow successfully'
	}
	}
	else {
	await FollowDb
	.findOne(FindData)
	.remove();
	RetData.ChangeType = 'Un-Follow';
	RetData.toast = {
		type: 'success',
		msg: 'Un-Follow successfully'
	}
	}
	res.json(RetData);
});
}

export const FollowList = async (req, res) => {
var ReqBody = req.body;
var target = ReqBody.target;
var addr = ReqBody.addr;

var FindData = {};
var SelectData = {};
if(target == 'following') {
	FindData.follower = addr;
	SelectData.owner = 1;
} else if(target == 'follower') {
	FindData.owner = addr;
	SelectData.follower = 1;
}

FollowDb.find(FindData,{})
.then((data) => {
	if(data.length == 0) {
	res.json({list:[]});
	}
	else {
	res.json({list:data});
	}
})
.catch((e) => {
	res.json({ "err ": e, list:[] })
})
}

	export const ChangeReceiptStatus = async (req, res) => {
		var ReqBody = req.body;
		var reqStatus = ReqBody.status;
		var hashValue = ReqBody.hashValue;
		TokenDb.findOneAndUpdate({ "hashValue": hashValue }, { $set: { "status": reqStatus } })
		.then((data) => {
			res.json(data)
		})
		.catch((e) => {
			res.json({ "err ": e })
		})
	}

	export const Details_Get = async (req, res) => {
		var RetData = {};
		var ReqBody = req.body;
		RetData.MyItemAddr = {};
		RetData.User = {};
		var addr = '';
		var customurl = '';
		if(ReqBody.addr) {
			addr = ReqBody.addr;
		}
		if(ReqBody.customurl) {
			customurl = ReqBody.customurl;
		}

		if(customurl) {
			var FindData = { customurl: customurl };
		} else if (addr) {
			var FindData = { curraddress: addr };
		} else {
			return res.json(RetData);
		}

		//  console.log('userDa123',FindData);
		var Respuser = await UserDb.findOne(FindData);
		if(Respuser && Respuser.curraddress) {
			RetData.User = Respuser;
			addr = Respuser.curraddress;
		}

		FindData = {};
		FindData.currAddress = addr;
		var Resp = await MyItemAddrDb.findOne(FindData);
		if (Resp != null) {
			RetData.MyItemAddr = Resp;
		}
		return res.json(RetData);
	}

	export const getfollowers = async (req,res) => {
		try {
			var currAddress = req.body.curraddress;
			var tab = req.body.tab;
			//  console.log(">>>>>>follower",currAddress);
			if ( tab === 'follower' ){
				var data = await FollowerDB.aggregate(
						[{
							"$match" : {
								userAddress : { "$eq" : currAddress } }
							},
							{
								$lookup : {
									from: "users",
									localField: "followerAddress",
									foreignField: "curraddress",
									as: "users"
								}
							},
							{
								$lookup : {
									from: "tokens",
									localField: "tokenOwner",
									foreignField: "curraddress",
									as: "collectibles"							
								}
							}
					]
				)
			}else {
				var data = await FollowerDB.aggregate(
					[{
						"$match" : {
							followerAddress : { "$eq" : currAddress } }
						},
						{
							$lookup : {
								from: "users",
								localField: "userAddress",
								foreignField: "curraddress",
								as: "users"
							}
						},
						{
							$lookup : {
								from: "tokens",
								localField: "tokenOwner",
								foreignField: "curraddress",
								as: "collectibles"							
							}
						}
					]
				)
			}
			//  console.log(">>>following",JSON.stringify(data))
			return res.json({
				success: true,
				list: data,
			});
		}catch(err) {
			return res.json({
				err: err,
				success: false,
				msg: "Error on server",
			  });
		}
	}
	export const followUnfollow = async (req, res) => {
		var reqBody = req.body;
		var { curraddress , followeraddress } = reqBody
		var isFollow = await FollowerDB.find( {userAddress : curraddress, followerAddress : followeraddress});
		//  console.log(isEmpty(isFollow));
		if (!isEmpty(isFollow)) {
			var unfollow = await FollowerDB.remove( {userAddress : curraddress, followerAddress : followeraddress});
			//  console.log("remove",unfollow);
			await ActivityHelper.save({
				createData : {
					action : `${curraddress} follow ${followeraddress}`,
					from : curraddress,
					tokenCounts : followeraddress
				}
			});
			return res.json({
				success: true,
				message : "Unfollow"
			});
		} else {
			var follow = new FollowerDB( { userAddress :  curraddress , followerAddress : followeraddress })
			var data = await follow.save();
			//  console.log('save',data);
			await ActivityHelper.save({
				createData : {
					action : `${curraddress} Unfollow ${followeraddress}`,
					from : curraddress,
					tokenCounts : followeraddress
				}
			});
			return res.json({
				success: true,
				message : "Follow"
			});
		}
	}

	export const connectedFollower = async (req, res) => {
		var reqBody = req.body;
		var { curraddress , followeraddress } = reqBody
		var isFollow = await FollowerDB.find( {userAddress : curraddress, followerAddress : followeraddress});

		if (!isEmpty(isFollow)) {
			return res.json({
				success: true,
				message : "Unfollow"
			});
		} else {
			return res.json({
				success: true,
				message : "Follow"
			});
		}
	}
	
	export const getSearchList = async (req,res) => {
		var ReqBody = req.body;
		//  console.log(ReqBody);

		var RetData = {
			users:[],
			items:[],
			collections:[]
		  };
		  var ReqBody = req.body;
		  var keyword = ReqBody.keyword;

		  async.waterfall([
			function (done) {
			  var findData = {};
			  findData.name = {
				$regex : keyword
			  }
			  UserDb.find(findData,{},{limit: 3}, (err, respData) => {
				if(respData) {
				  RetData.users = respData;
				}
				done();
			  });
			},
			function (done) {
			  var findData = {};
			  findData.tokenName = {
				$regex : keyword
			  }
			  TokenDb.find(findData,{},{limit: 3}, (err, respData) => {
				if(respData) {
				  RetData.items = respData;
				}
				done();
			  });
			},
			function (done) {
			//  console.log(RetData);
			  res.json(RetData);
			},
		  ], function (err, result) {
			if (err) return false;
		  });
	}
	export const getprofile = async (req, res) => {
	var reqBody = req.body;
		//  console.log('lastone',reqBody);
		UserDb.findOne({ 'curraddress': reqBody.currAddr }, (err, userData) => {
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

		export const Details_GetOrSave = async (req, res) => {
		var RetData = {};
		var ReqBody = req.body;
		var FindData = {};
		RetData.User = {};
		//  console.log("fdjkjjhkjhjhkjhjkhjjkhjkhkhjkhhjjkhkhjhkhjkhhjhhjkhkjhjkhjjkhhkjhgc",ReqBody)
		if(ReqBody.customurl) {
			var FindData = { customurl: ReqBody.customurl }
		} else if (ReqBody.addr) {
			var FindData = { curraddress: ReqBody.addr }
		} else {
			return res.json(RetData)
		}
		if(FindData!={}){
		var Respuser = await UserDb.findOne(FindData);
		
		// var Respuser = await UserDb.findOne({$or:[{"customurl":ReqBody.customurl},{"curraddress":ReqBody.curraddress}]})
		//  console.log("asjkalsdjklasjdlasjdlkasjdklasjdasdlasjdklsajdklasdaslkdlasd",Respuser)
		if(Respuser && Respuser.curraddress) {
			RetData.found = true;
			RetData.User = Respuser;
			return res.json(RetData);
		}
		else {
			var NewRec = { 
				_id : ReqBody.addr,
				curraddress: ReqBody.addr 
			};
			var SaveRec = UserDb(NewRec);
			SaveRec.save()
			.then(data => {
			RetData.User = data;
			return res.json(RetData);
			})
			.catch(e => {
			return res.json(RetData);
			})
		}
		}
		else{
		  //  console.log("no addrs here")
		}
		}

		export const editprofileval = async(req, res, next) => {
			//  console.log('-------------->>>valid',req.body,req.files,req.photo)
			return next();
		}

	export const editprofile = async (req, res) => {

		//  console.log('----------FUNCT')   
		var reqBody = req.body;
		console.log('>>>>>>EditProfile',JSON.parse(reqBody.fields))
		var files = req.files;
		let updateData = await UserDb.findOne({ "curraddress": reqBody.currAddr });
		if (updateData) { 
		//  console.log('----------if(updateData)')  //already inserted data
			if (files != null) {
			//  console.log('----------TESTTTTTTTTT')
			var test = await UserDb.findOneAndUpdate(
				{ _id: updateData._id },
				{
					name: reqBody.name,
					personalsite: reqBody.personalsite,
					customurl: reqBody.customurl,
					bio: reqBody.bio,
					twitter: reqBody.twitter,
					curraddress: reqBody.currAddr,
					fields : JSON.parse(reqBody.fields),
					image: files.photo.name
				}
			);
			fs.mkdir('public/images/' + test._id, { recursive: true }, function (err) {
				if (err) return //  console.log('cannot create public/product_images/ directory');
				//  console.log('public/product_images/ directory created');
			
				var productImage = req.files.photo;
				var path = 'public/images/'+test._id+'/'  + productImage.name;
				productImage.mv(path, function (err) {
				if (err)
					 console.log(err);
				});
			});
			return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", test })

			} else {
			//  console.log('----------if(1stElse)') 
			var test = await UserDb.findOneAndUpdate(
				{ _id: updateData._id },
				{
				name: reqBody.name,
				personalsite: reqBody.personalsite,
				customurl: reqBody.customurl,
				bio: reqBody.bio,
				twitter: reqBody.twitter,
				curraddress: reqBody.currAddr,
				fields : JSON.parse(reqBody.fields),
				image: updateData.image
				}
			);
			return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", test })
			}

		} else { /// new record inserted
			//  console.log('----------if(2d Else)')
			let errors = {}, reqBody = req.body;
			let file = req.files;
			//  console.log(file,'----------fileee')
			let imageFormat = /\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif)$/;
			let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
			var urltest = await UserDb.findOne({"customurl":reqBody.customurl})
			var urltest1= await UserDb.findOne({"curraddress":reqBody.currAddr,"customurl":reqBody.customurl})
			if(file==null){
				errors.photo = "Image is Required"
			}else if (!imageFormat.test(file.photo.name)) {
					errors.photo = "Please select valid image."
			}else if (5000000<file.photo.size ) {  // 5 MB
					errors.photo = "Too large"
			}
			if (isEmpty(reqBody.name)) {
					errors.name = "Display Name field is required";
			}

			if (isEmpty(reqBody.customurl)) {
				errors.customurl = "Custom url field is required";
			}
			//  console.log(urltest1)
			if (urltest1==null) {
				if (urltest!=null) {
					errors.customurl = "Custom url field is exist";
				}
			}  
			if (!isEmpty(errors)) {
				return res.status(400).json({ "errors": errors })
			}
			if (files != null) {
			var user = new UserDb({
				"name": reqBody.name,
				"personalsite": reqBody.personalsite,
				"customurl": reqBody.customurl,
				"bio": reqBody.bio,
				"twitter": reqBody.twitter,
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
				if (err) return //  console.log('cannot create public/product_images/ directory');
				});
				fs.mkdir('public/images/user/' + user._id, { recursive: true }, function (err) {
				if (err) return //  console.log('cannot create public/product_images/ directory');
				});
				var productImage = req.files.photo;
				var path = 'public/images/user/' + productImage.name;
				var thumbsPath = 'public/images/user/' + '/resizeImg/' + '/' + productImage.name;
				productImage.mv(path, function (err) {
				if (err)
					 console.log(err);
				});
				return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", result })
			})
			} else {
			var user = new UserDb({
				"name": reqBody.name,
				"personalsite": reqBody.personalsite,
				"customurl": reqBody.customurl,
				"bio": reqBody.bio,
				"twitter": reqBody.twitter,
				"curraddress": reqBody.currAddr,
			})
			UserDb.save(function (err, result) {
				if (err) {
				//  console.log("errrrrrrrrr", error)
				res
					.status(500)
					.json({ success: false, errors: { messages: "Error on server" } });
				}

				return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", result })
			})
			}
		}
	}

	export const coverimagevalidations = async (req, res) => {
		let errors = {};
		let file = req.files;
		//  console.log(req.files.image.name, '----------fileee')
		//  console.log("````````````````````````````````````````````````````" + JSON.stringify(req.body))
		//  console.log('`````````````````````````````````````````````````````````````'+JSON.stringify(errors))
		let imageFormat = /\.(png|PNG|gif|WEBP|webp|JPEG|jpg|JPG)$/;
		if (file == null) {
				errors.file = "Image is Required"
		} else if (!imageFormat.test(req.files.image.name)) {
				errors.file = "Please select valid image."
		} else if (10000000 < req.files.image.size) {  // 10 MB
				errors.file = "Too large"
		}
		//  console.log('`````````````````````````````````````````````````````````````'+JSON.stringify(errors))
		if(!isEmpty(errors)) {
		  return res.status(400).json({ "errors": errors });
		}
		//  console.log('`````````````````````````````````````````````````````````````'+JSON.stringify(errors))
		return res.status(200).json({ "errors": errors });
	}
	
	
	export const coverImage = async (req, res) => {
		var files = req.files;
		//  console.log("files", files)
		var reqBody = req.body;
		let updateData = await UserDb.findOne({ "curraddress": reqBody.accounts });
		if (updateData !=null) {
			//  console.log("44444444444444444444444444444",updateData)
			UserDb.findOneAndUpdate(
				{ "curraddress": updateData.curraddress },
				{"$set":{

				"coverimage": req.files.coverimage.name
				}}
			)
			.exec((err,test)=>{
				if(err) return //  console.log(err)
				//  console.log("2121212122222222222222222222222222222222222222222222222222222222",test)
				fs.mkdir('public/images/coverimages/' + test._id, { recursive: true }, function (err) {
					if (err) return ////   //  //  console.log("('cannot create public/product_images/ directory');
					var productImage = req.files.coverimage;
					var path = 'public/images/coverimages/' + test._id + '/' + req.files.coverimage.name;
				productImage.mv(path, function (err) {
					if (err)
						 console.log(err);
				});
			});
			//  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",test)
			return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", test })
			})
			.catch(()=>{
			//  console.log(e)
			})
		} else {
		
			var test = new UserDb({
				"curraddress": reqBody.accounts,
				"coverimage": files.coverimage.name
			})
			test.save(function (err, result) {
				if (err) {
				res
					.status(500)
					.json({ success: false, errors: { messages: "Error on server" } });
				}
				fs.mkdir('public/images/coverimages/' + test._id, { recursive: true }, function (err) {
				if (err) return //   //  //  console.log("('cannot create public/product_images/ directory');

				var productImage = req.files.coverimage;
				var path = 'public/images/coverimages/' + test._id + '/' + req.files.coverimage.name;
				productImage.mv(path, function (err) {
				if (err)
					console.log(err);
				});
			});
				return res.status(200).json({ 'success': true, 'message': "Please Create profile first",test })
			})
		}
		}

		
		export const pics1 = async (req, res) => {
			var files = req.files;
			//  console.log("files", req.body)
			//  console.log("files", files)
			var reqBody = req.body;
			let updateData = await UserDb.findOne({ "curraddress": reqBody.addr });
			if (updateData !=null) {
				//  console.log(updateData)
				return res.status(200).json({ 'success': true, 'message': "image get successfully","_id":updateData._id, "coverimage":updateData.coverimage,"image":updateData.image })
			} else {
		
				return res.status(200).json({ 'success': true, 'message': "Please Create profile first" })
			}
		}

		export const Activity = async (req, res) => {
			var RetData = {};
			var ReqBody = req.body;
			var ReqParams = req.params;
		  
			var addr = ReqBody.addr;
		  
			var limitQuery = {};
			if(ReqParams.from == 'header') {
			  limitQuery.limit = 10;
			}
		  
			var findData = {
			  tokenOwner:addr,
			  balance: {$gt:0}
			};
		  
			//  console.log('limitQuery : ', limitQuery, 'findData : ', findData);
		  
			TokenOwnerDb.find(findData, {}, limitQuery, (err, respData) => {
			  var tokenCounts = [];
			  if(!isEmpty(respData))
				for (let i = 0; i < respData.length; i++) {
					const element = respData[i];
					tokenCounts.push(element.tokenCounts);      
			  }
			  var matchData = {};
			  matchData.status = 'new';
			  // matchData.tokenCounts = {$in : tokenCounts};
			  matchData.to = {$eq : addr};
		  
			  // matchData['$or'] = [
			  //   { tokenCounts : {$in : tokenCounts} },
			  //   { to : {$eq : addr} }
			  // ];
		  
			  //  console.log('matchData : ', matchData);
		  
			  var query = [
				{
				  $match : matchData
				},
				{
					$sort : { 'created' : -1 }
				},
				{
				  $lookup: {
					from: "users",
					localField: "from",
					foreignField: "curraddress",
					as: "from_users"
				  },
				},
				{
				  $unwind: {
					path: '$from_users',
					preserveNullAndEmptyArrays: true,
				  }
				},
				{
				  $lookup: {
					from: "tokens",
					localField: "tokenCounts",
					foreignField: "tokenCounts",
					as: "tokens"
				  },
				},
				{
				  $unwind: {
					path: '$tokens',
					preserveNullAndEmptyArrays: true,
				  }
				},
			  ]
			  ActivityDb.aggregate(query, (err, respData) => {
				if(respData) {
				  RetData.list = respData;
				}
				res.json(RetData);
			  });
			});
		  }

		  export const getAllProfile = async (req, res) => {
			console.log("followerrrr ininn")
			await UserDb.aggregate([  {
				$lookup: {
				  from: 'followers',
				  localField: 'curraddress',
				  foreignField: 'userAddress',
				  as: 'followerl'
				}
			  },
					  
			 
			  {
				$project: {
							  _id : 1,
							  name : 1,
							  personalsite : 1,
							  customurl : 1,
							  bio : 1,
							  twitter : 1,
							  instagram : 1,
							  facebook : 1,
							  youtube : 1,
							  description : 1,
							  image : 1,
							  coverimage : 1,
							  curraddress : 1,
							  deleted : 1,
							  date : 1,			 
				  name: 1,
							  numberOfFollower: {
										$cond: {
												if: {
													 $isArray: "$followerl"
													  },
												then: {
													 $size: "$followerl"
													   },
												 else: "0"
												 }
												}
				}
			  }
					  ]).then((result) => {
				  console.log("followerlookup",result)
				  res.json({ success: true, userValue: result })
			  }).catch((error) => {
				  res.json({"error":error})
				})
			
		  }