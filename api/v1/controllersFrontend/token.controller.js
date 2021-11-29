import e from 'express';
import fs from 'fs'
import path from 'path'
import mongoose, { now } from 'mongoose';
import ipfsClient, { CID } from 'ipfs-http-client';
import cmsnew, { update } from '../admin/Model/cmsnew';
import SettingDB from '../admin/Model/settings';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath)
var compress_images = require('compress-images');
const sharp = require("sharp");
const gify = require("gify");
const Config = require(path.resolve('./config/config')).default;
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https', method: 'POST', auth: `${Config.ipfskey}:${Config.ipfspass}` });
const async = require("async");
const ObjectId = mongoose.Types.ObjectId;
console.log('ipfskey', Config.ipfskey);

const CategoryDb = require(path.resolve('./models/category'));
const TokenDb = require(path.resolve('./models/Token'));
const Collection = require(path.resolve('./models/Collection'));
const FollowDb = require(path.resolve('./models/follow'));
const BiddingDb = require(path.resolve('./models/bid'));

const Faq = require('../admin/Model/faq');
const MyItemAddrDb = require(path.resolve('./models/myItemAddr'));
const TokenOwnerDb = require(path.resolve('./models/TokenOwner'));
const ActivityDb = require(path.resolve('./models/activity'));
const LikeDb = require(path.resolve('./models/like'));
const TokenIdtableDb = require(path.resolve('./models/tokenIdtable'));
const isEmpty = require(path.resolve('./config/isEmpty'));
const MongooseHelper = require('../helpers/mongoose-helper');
const MicroownershipDB = require(path.resolve('./models/microownership'));

const MicroslotbookingDb = require(path.resolve('./models/microSlotBooking'));
const ActivityHelper = require('../helpers/activity-helper');

let AllowedUploadFormat = /\.(png|PNG|gif|WEBP|webp|mpeg|mp4|mp3|video|audio)$/;

export const BidCancel = async (req, res) => {
	var ReqBody = req.body;
	var RetData = {}
	var FindData = {
		tokenBidAddress: ReqBody.tokenBidAddress,
		tokenCounts: ReqBody.tokenCounts
	};

	FindData['$and'] = [
		{ status: { $ne: 'cancelled' } },
		{ status: { $ne: 'partiallyCancelled' } },
		{ status: { $ne: 'completed' } }
	];

	var AlreadyChk = await BiddingDb.findOne(FindData).exec();
	if (AlreadyChk) {
		var status = AlreadyChk.status;
		// if(status == 'cancelled' || status == 'partiallyCancelled' || status == 'completed') {
		//   RetData.type = 'error';
		//   RetData.toast = { type:'error', message: 'Bid already closed' }
		//   return res.status(200).json(RetData); 
		// }
		var FindData = { _id: AlreadyChk._id };
		var UpdateData = {};
		if (status == 'pending') {
			UpdateData.status = 'cancelled';
		}
		else if (status == 'partiallyCompleted') {
			UpdateData.status = 'partiallyCancelled';
		}
		BiddingDb.findOneAndUpdate(
			FindData,
			{ $set: UpdateData },
			{ new: true }
		)
			.exec(async function (err, data) {
				if (data) {
					RetData.type = 'success';
					RetData.toast = {
						type: 'success',
						message: 'Bid successfully cancelled'
					}
				}
				else {
					RetData.type = 'error';
					RetData.toast = {
						type: 'error',
						message: 'Bid not cancelled'
					}
				}
				return res.status(200).json(RetData);
			});
	}
	else {
		RetData.type = 'error';
		RetData.toast = {
			type: 'error',
			message: 'Active bid not found'
		}
		return res.status(200).json(RetData);
	}
}
export const BidAccept = async (req, res) => {
	var RetData = {};
	RetData.toast = {};
	var ReqBody = req.body;
	var UserAccountAddr_byaccepter = ReqBody.UserAccountAddr_byaccepter;
	var tokenBidAddress = ReqBody.tokenBidAddress;
	var FindData = {
		tokenBidAddress: ReqBody.tokenBidAddress,
		tokenCounts: ReqBody.tokenCounts,
		'$and': [
			{ status: { '$ne': 'completed' } },
			{ status: { '$ne': 'cancelled' } }
		]
	};

	if (ReqBody.transactionHash && ReqBody.transactionHash != '') {
		var hashValue = ReqBody.transactionHash;
	}
	else {
		RetData.toast.type = 'error';
		RetData.toast.msg = 'Transaction not completed';
		return res.json(RetData);
	}

	var NoOfToken = ReqBody.NoOfToken;
	var AlreadyChk = await BiddingDb.find(FindData).exec();
	if (AlreadyChk && AlreadyChk.length > 0) {
		var Already = AlreadyChk[0];

		var UpdateData = {};
		if (Already.completed > 0) {
			UpdateData.completed = Already.completed + NoOfToken;
		}
		else {
			UpdateData.completed = NoOfToken;
		}

		UpdateData.pending = Already.pending - NoOfToken;

		if (UpdateData.pending == 0) {
			UpdateData.status = 'completed';
		}
		else if (UpdateData.pending > 0) {
			UpdateData.status = 'partiallyCompleted';
		}

		BiddingDb.findOneAndUpdate(
			FindData,
			{ $set: UpdateData },
			{ new: true }
		)
			.exec(async function (err, data) {
				if (data) {
					RetData.toast = { type: 'success', msg: 'Bid accept successfully' }
					TokenOwnerDb.findOne(
						{
							tokenOwner: UserAccountAddr_byaccepter,
							tokenCounts: ReqBody.tokenCounts,
						},
						{
							_id: 0,
							timestamp: 0,
							__v: 0
						}
					).exec(async function (err, respOfPur) {


						var UpdateData = {};
						if (
							(respOfPur.type == 721)
							||
							(respOfPur.type == 1155 && respOfPur.balance == NoOfToken)
						) {
							UpdateData.balance = 0;
						}
						else if (respOfPur.type == 1155 && respOfPur.balance > NoOfToken) {
							UpdateData.balance = respOfPur.balance - NoOfToken;
						}

						if (UpdateData.balance == 0) {
							UpdateData.tokenPrice = 0;
						}

						TokenOwnerDb.findOneAndUpdate(
							{
								tokenOwner: UserAccountAddr_byaccepter,
								tokenCounts: ReqBody.tokenCounts,
							},
							{ $set: UpdateData },
							{ new: true }
						)
							.exec(async function (err, UpdResp) {
								if (err) {
									RetData.toast.type = 'error';
									RetData.toast.msg = Config.errorOccured;
									return res.json(RetData);
								}
								else if (UpdResp == null) {
									RetData.toast.type = 'error';
									RetData.toast.msg = 'Collectible bid accept failed';
									return res.json(RetData);
								}
								else {
									if (respOfPur.type == 721) {
										var newBalance = 1;
										NoOfToken = 1;
									}
									else {
										var newBalance = NoOfToken;
									}
									await neworoldownerupdate(
										respOfPur,
										tokenBidAddress,
										newBalance,
										hashValue,
										NoOfToken,
										'afterbid'
									);
									return res.json(RetData);
								}
							});


					})
				}
				else {
					// console.log('err : ', err);
					RetData.toast = { type: 'error', msg: 'Bid not accepted' }
					res.json(RetData);
				}
			})
	}
	else {
		RetData.toast = { type: 'error', msg: 'Bid not found' }
		res.json(RetData);
	}
}

async function neworoldownerupdate(respOfPur, UserAccountAddr, newBalance, hashValue, NoOfToken, from) {
	try {
		var IsOldItem = await TokenOwnerDb.findOne(
			{
				tokenCounts: respOfPur.tokenCounts,
				tokenOwner: UserAccountAddr
			}
		).exec();
		if (IsOldItem == null) {
			var NewData = {
				tokenCounts: respOfPur.tokenCounts,
				tokenOwner: UserAccountAddr,
				tokenPrice: 0,
				balance: newBalance,
				quantity: newBalance,
				contractAddress: respOfPur.contractAddress,
				hashValue: hashValue,
				status: respOfPur.status,
				type: respOfPur.type,
			}
			var TokenOwnerNew = new TokenOwnerDb(NewData);
			TokenOwnerNew.save();
			return true;
		}
		else {
			var UpdData = {
				tokenCounts: respOfPur.tokenCounts,
				tokenOwner: UserAccountAddr,
				contractAddress: respOfPur.contractAddress,
				hashValue: hashValue,
				status: respOfPur.status,
				type: respOfPur.type,
			};

			var newbalance = parseInt(newBalance) + parseInt(IsOldItem.balance);
			UpdData.balance = newbalance;

			var newquantity = 0;

			if (parseInt(IsOldItem.quantity) == 0) {
				newquantity = parseInt(newBalance);
				UpdData.quantity = newquantity;
			}
			else if (parseInt(IsOldItem.quantity) == parseInt(IsOldItem.balance)) {
				newquantity = parseInt(IsOldItem.quantity) + parseInt(newBalance);
				UpdData.quantity = newquantity;
			}
			else if (parseInt(IsOldItem.quantity) > parseInt(IsOldItem.balance)) {
				var diff = parseInt(IsOldItem.quantity) - parseInt(IsOldItem.balance);
				if (diff < NoOfToken) {
					UpdData.quantity = UpdData.balance;
				}
			}

			await TokenOwnerDb.findOneAndUpdate(
				{
					tokenCounts: respOfPur.tokenCounts,
					tokenOwner: UserAccountAddr
				},
				{
					$set: UpdData
				}
			).exec();

			return true;
		}
	}
	catch (err) {
		return false;
	}
}

export const BidApply = async (req, res) => {
	var ReqBody = req.body;
	var FindData = {
		tokenBidAddress: ReqBody.tokenBidAddress,
		tokenCounts: ReqBody.tokenCounts,
		// status : 'pending',
		'$or': [
			{ status: 'pending' },
			{ status: 'partiallyCompleted' }
		]
	};
	var AlreadyChk = await BiddingDb.find(FindData).exec();
	if (AlreadyChk && AlreadyChk.length > 0) {
		var UpdateData = {
			tokenBidAmt: ReqBody.tokenBidAmt,
			tokenBidAddress: ReqBody.tokenBidAddress,
			tokenCounts: ReqBody.tokenCounts,
			NoOfToken: ReqBody.NoOfToken,
		}
		BiddingDb.findOneAndUpdate(
			FindData,
			{ $set: UpdateData },
			{ new: true }
		)
			.exec(async function (err, data) {
				if (data) {
					res.json({ "type": "success", data: data });
				}
				else {
					res.json({ "type": "fail", e: e });
				}
			})
	}
	else {
		var NewBidAdd = new BiddingDb({
			tokenBidAmt: ReqBody.tokenBidAmt,
			tokenBidAddress: ReqBody.tokenBidAddress,
			tokenCounts: ReqBody.tokenCounts,
			NoOfToken: ReqBody.NoOfToken,
			pending: ReqBody.NoOfToken,
		})
		NewBidAdd.save()
			.then((data) => {
				res.json({ "type": "success", data: data });
			})
			.catch((e) => {
				res.status(200).json({ "type": "fail", e });
			})
	}
}

export const TokenCounts = async (req, res) => {
	var RetData = {};
	RetData.toast = {};
	var ReqBody = req.body;
	var tokenCounts = ReqBody.tokenCounts ? parseInt(ReqBody.tokenCounts) : 0;
  
	var Detail = {
	  Resp: {}
	};
	var Tdata = await TokenOwnerDb.aggregate([
		{
			$match : { 
				tokenCounts : tokenCounts,
				balance : { $ne : 0 }
			}
		},
		{
				$lookup : {
						from : 'users',
						localField : 'tokenOwner',
						foreignField : 'curraddress',
						as : 'tusers'
				} 
		},
		{
				$unwind : {
						path : '$tusers',
						preserveNullAndEmptyArrays: true,
				}
		},
		{
			$sort : { timestamp : 1 }
		}
	]);

	async.waterfall([
	  function (done) {
		var Query = [
		  { $match: { tokenCounts: tokenCounts } },
		  {
			$lookup:
			{
			  from: "tokenowners",
			  localField: "tokenCounts",
			  foreignField: "tokenCounts",
			  as: "tokenowners_all"
			},
		  },
		  {
			$lookup:
			{
			  from: "tokenowners",
			  let: { tC: "$tokenCounts" },
			  pipeline: [
				{
				  $match:
				  {
					$expr:
					{
					  $and:
						[
						  { $eq: ["$tokenCounts", "$$tC"] },
						  { $gt: ["$balance", 0] }
						]
					}
				  }
				},
				{ $project: { _id: 0 } }
			  ],
			  as: "tokenowners_current"
			}
		  },
		  {
			$lookup:
			{
			  from: "tokenowners",
			  let: { tC: "$tokenCounts" },
			  pipeline: [
				{
				  $match:
				  {
					$expr:
					{
					  $and:
						[
						  { $eq: ["$tokenCounts", "$$tC"] },
						  { $eq: ["$status", 'true'] },
						  { $gt: ["$tokenPrice", 0] },
						  { $gt: ["$balance", 0] }
						]
					}
				  }
				},
				{ $project: { _id: 0 } }
			  ],
			  as: "OnSaleOwner"
			}
		  },
  
		  {
			$lookup: {
			  from: "users",
			  localField: "tokenCreator",
			  foreignField: "curraddress",
			  as: "tokencreatorinfo"
			},
		  },
		  {
			$lookup: {
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
			$lookup: {
			  from: "users",
			  localField: "tokenowners_all.tokenOwner",
			  foreignField: "curraddress",
			  as: "tokenuser"
			}
		  },
		  {
			$project: {
			  _id: 1,
			  tokenPrice: 1,
			  tokenCategory: 1,
			  tokenCharity: 1,
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
			  additionalImage: 1,
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
			  tokenowners_current: 1,
			  coinname: 1,
			  tokenowners_all: 1,
			  OnSaleOwner: 1,
			  tokenOwnerInfo: {
				_id: "$tokenuser._id",
				image: "$tokenuser.image",
				name: "$tokenuser.name",
				curraddress: "$tokenuser.curraddress",
				customurl: "$tokenuser.customurl"
			  },
			  tokenCreatorInfo: {
				_id: "$tokencreatorinfo._id",
				image: "$tokencreatorinfo.image",
				name: "$tokencreatorinfo.name",
				curraddress: "$tokencreatorinfo.curraddress",
				customurl: "$tokencreatorinfo.customurl"
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
		];
		TokenDb.aggregate(Query).exec(async function (err, resp) {
		  if (err) {
			RetData.toast.type = 'error';
			RetData.toast.msg = Config.errorOccured;
			return res.json(RetData);
		  }
		  else {
			Detail.Resp.Token = resp;
			Detail.Resp.Tusers = Tdata;
			done();
		  }
		});
	  },
	  function (done) {
		// var findData = {
		//   tokenCounts:tokenCounts,
		//   status:'pending'
		// '$or':[
		//   {status:'pending'},
		//   {status:'partiallyCompleted'}
		// ]
		// }
		// BiddingDb
		// .find(findData)
		// .sort({tokenBidAmt:-1})
		var aggregateData = [
		  {
			$match: {
			  tokenCounts: tokenCounts,
			}
		  },
		  {
			$match: {
			  '$or': [
				{ status: 'pending' },
				{ status: 'partiallyCompleted' }
			  ]
			}
		  },
		  {
			$sort: { tokenBidAmt: -1 }
		  },
		  {
			$lookup: {
			  from: "users",
			  localField: "tokenBidAddress",
			  foreignField: "curraddress",
			  as: "bidUsers"
			}
		  },
		  {
			$unwind: {
			  path: '$bidUsers',
			  preserveNullAndEmptyArrays: true,
			}
		  },
		];
  
  
  
		// / BiddingDb
		// .find(findData)
		// .sort({tokenBidAmt:-1})
		BiddingDb.aggregate(aggregateData)
		  .exec(async function (err, resp) {
			if (err) {
			  //console.log('err : ', err);
			  RetData.toast.type = 'error';
			  RetData.toast.msg = Config.errorOccured;
			  return res.json(RetData);
			}
			else {
			  Detail.Resp.Bids = { pending: [], completed: [], highestBid: {}, myBid: {} };
			  Detail.Resp.Bids.pending = resp;
  
			  if (resp.length > 0) {
				Detail.Resp.Bids.highestBid = resp[0];
				//console.log("chcek1 highestBid : ", resp)
				//console.log(ReqBody.curAddr)
				if (resp && resp.length > 0) {
				  var IndexVal = resp.findIndex(val => val.tokenBidAddress == ReqBody.curAddr);
				  //console.log("chcek1 IndexVal : ", IndexVal)
				  if (IndexVal > -1) {
					//console.log("chcek1 myBid ", resp[IndexVal])
					Detail.Resp.Bids.myBid = resp[IndexVal];
				  }
				}
			  }
  
			  var findData = {
				tokenCounts: tokenCounts,
				'$or': [
				  { status: 'completed' },
				  { status: 'partiallyCancelled' },
				  { status: 'partiallyCompleted' }
				]
			  }
			  var resp = await BiddingDb.find(findData).exec();
			  Detail.Resp.Bids.completed = resp;
			  done();
			}
		  });
	  },
	  function (done) {
  
		var OnSaleBalance = 0;
		var TotalQuantity = 0;
  
		if (Detail.Resp.Token && Detail.Resp.Token[0]) {
		  if (Detail.Resp.Token[0].tokenowners_all) {
			TotalQuantity = Detail.Resp.Token[0].tokenQuantity;
			var tokenowners_all = Detail.Resp.Token[0].tokenowners_all
			for (let i = 0; i < tokenowners_all.length; i++) {
			  const element = tokenowners_all[i];
			  if (element.balance > 0 && element.tokenPrice > 0) {
				OnSaleBalance = OnSaleBalance + element.balance;
			  }
			}
		  }
		}
  
		Detail.Resp.OnSaleBalance = OnSaleBalance;
		Detail.Resp.TotalQuantity = TotalQuantity;
		done();
	  },
	  function (done) {
		RetData.Detail = Detail;
		//console.log("find all valuess", RetData)
		return res.json(RetData);
	  }
	], function (err, result) {
	  if (err) return false;
	});
  }

export const PurchaseComplete = async (req, res) => {
	var RetData = {};
	RetData.toast = {};
	var ReqBody = req.body;
	console.log('>>>ReqBody',ReqBody);
	var from = ReqBody.from;
	var to = ReqBody.to;
	var tokenOwner = ReqBody.tokenOwner;
	var UserAccountAddr = ReqBody.UserAccountAddr;
	var tokenCounts = ReqBody.tokenCounts;
	var tokenType = ReqBody.tokenType;

	var NoOfToken = 1;
	if (ReqBody.NoOfToken) {
		NoOfToken = ReqBody.NoOfToken;
	}

	if (ReqBody.transactionHash && ReqBody.transactionHash != '') {
		var hashValue = ReqBody.transactionHash;
	}
	else {
		RetData.toast.type = 'error';
		RetData.toast.msg = 'Transaction not completed';
		return res.json(RetData);
	}

	// console.log('PurchaseComplete', ReqBody);

	async.waterfall([
		function (done) {
			TokenDb.findOne({
				tokenCounts: tokenCounts,
				type: tokenType
			}).exec(async function (err, resp) {
				// console.log('1', err, resp);
				if (err) {
					RetData.toast.type = 'error';
					RetData.toast.msg = Config.errorOccured;
					return res.json(RetData);
				}
				else if (resp == null) {
					RetData.toast.type = 'error';
					RetData.toast.msg = 'Collectible not found';
					return res.json(RetData);
				}
				else {
					console.log('done');
					done();
				}
			});
		},
		function (done) {
			TokenOwnerDb.findOne(
				{
					tokenOwner: tokenOwner,
					tokenCounts: tokenCounts,
					type: tokenType,
					// balance: {'$ne': 0}
				},
				{
					_id: 0,
					timestamp: 0,
					__v: 0
				}
			).exec(async function (err, respOfPur) {
				// console.log('1', err, respOfPur);
				if (err) {
					RetData.toast.type = 'error';
					RetData.toast.msg = Config.errorOccured;
					return res.json(RetData);
				}
				else if (respOfPur == null) {
					RetData.toast.type = 'error';
					RetData.toast.msg = 'Collectible not found';
					return res.json(RetData);
				}
				else {
					if (respOfPur.balance == 0) {
						RetData.toast.type = 'error';
						RetData.toast.msg = 'Collectible sale already completed';
						return res.json(RetData);
					}
					else if (respOfPur.type == 721 && respOfPur.balance == 1) {
						done('', respOfPur);
					}
					else if (respOfPur.type == 1155) {
						if (respOfPur.balance >= NoOfToken) {
							done('', respOfPur);
						}
						else {
							RetData.toast.type = 'error';
							RetData.toast.msg = 'Collectible sale already completed';
							return res.json(RetData);
						}
					}
				}
			});
		},
		function (respOfPur, done) {
			var UpdateData = {};
			if (
				(respOfPur.type == 721)
				||
				(respOfPur.type == 1155 && respOfPur.balance == NoOfToken)
			) {
				UpdateData.tokenPrice = 0;
				UpdateData.balance = 0;
			}
			else if (respOfPur.type == 1155 && respOfPur.balance > NoOfToken) {
				UpdateData.balance = respOfPur.balance - NoOfToken;
			}

			TokenOwnerDb.findOneAndUpdate(
				{
					tokenOwner: tokenOwner,
					tokenCounts: tokenCounts
				},
				{ $set: UpdateData },
				{ new: true }
			)
				.exec(async function (err, UpdResp) {
					if (err) {
						RetData.toast.type = 'error';
						RetData.toast.msg = Config.errorOccured;
						return res.json(RetData);
					}
					else if (UpdResp == null) {
						RetData.toast.type = 'error';
						RetData.toast.msg = 'Collectible purchase failed';
						return res.json(RetData);
					}
					else {
						RetData.toast.type = 'success';
						RetData.toast.msg = 'Collectible purchase successfully';

						if (respOfPur.type == 721) {
							var newBalance = 1;
						}
						else if (respOfPur.type == 1155 && respOfPur.balance == NoOfToken) {
							var newBalance = NoOfToken;
						}
						else if (respOfPur.type == 1155 && respOfPur.balance > NoOfToken) {
							var newBalance = NoOfToken;
						}

						try {
							var IsOldItem = await TokenOwnerDb.findOne(
								{
									tokenCounts: respOfPur.tokenCounts,
									tokenOwner: UserAccountAddr
								}
							).exec();
							if (IsOldItem == null) {
								var NewData = {
									tokenCounts: respOfPur.tokenCounts,
									tokenOwner: UserAccountAddr,
									tokenPrice: 0,
									balance: newBalance,
									quantity: newBalance,
									contractAddress: respOfPur.contractAddress,
									hashValue: hashValue,
									status: respOfPur.status,
									type: respOfPur.type,
									PutOnSale: false,
									from : from,
									to : to
								}
								var TokenOwnerNew = new TokenOwnerDb(NewData);
								TokenOwnerNew.save();
							}
							else {
								var UpdData = {
									tokenCounts: respOfPur.tokenCounts,
									tokenOwner: UserAccountAddr,
									// tokenPrice: 0,
									balance: parseInt(newBalance) + parseInt(IsOldItem.balance),
									quantity: parseInt(newBalance) + parseInt(IsOldItem.quantity),
									contractAddress: respOfPur.contractAddress,
									hashValue: hashValue,
									status: respOfPur.status,
									type: respOfPur.type,
									from : from,
									to : to
								}
								await TokenOwnerDb.findOneAndUpdate(
									{
										tokenCounts: respOfPur.tokenCounts,
										tokenOwner: UserAccountAddr
									},
									{
										$set: UpdData
									}
								).exec();
							}
						}
						catch (err) {
							// 
						}
						return res.json(RetData);
						// Notes : Need to delete bidding data
					}
				})
		}
	], function (err, result) {
		if (err) return false;
	});
}

export const TokenPriceChange = async (req, res) => {
	var RetData = {};
	var ReqBody = req.body;
	var tokenOwner = ReqBody.tokenOwner;
	var tokenCounts = ReqBody.tokenCounts;
	var tokenPrice = ReqBody.tokenPrice;
	var microNftPrice = ReqBody.microNftPrice;
	// console.log('ReqBody',ReqBody);
	if (!isEmpty(microNftPrice)) {
		var priceupdateformicroNft = await TokenDb.update({
			"tokenOwner": tokenOwner,
			"tokenCounts": tokenCounts,
		},
			{ "microNftPrice": parseFloat(microNftPrice) });
	}

	TokenOwnerDb
		.findOneAndUpdate(
			{
				"tokenOwner": tokenOwner,
				"tokenCounts": tokenCounts
			},
			{
				$set: {
					"tokenPrice": parseFloat(tokenPrice), "PutOnSale": (parseFloat(tokenPrice) > 0) ? true : false
				}
			}
		).then(data => {
			RetData.RetType = 'success';
			res.json(RetData);
		}).catch(e => {
			RetData.RetType = 'error';
			res.json(RetType);
		})
}

export const Burn = async (req, res) => {
	var RetData = {};
	var ReqBody = req.body;
	var tokenOwner = ReqBody.tokenOwner;
	var tokenCounts = ReqBody.tokenCounts;
	var burnCount = ReqBody.burnCount;
	var balance = ReqBody.balance;
	// console.log('ReqBody',ReqBody);
	TokenOwnerDb
		.findOneAndUpdate(
			{
				"tokenOwner": tokenOwner,
				"tokenCounts": tokenCounts,
			},
			{ $set: { "balance": balance, "burnCount": burnCount } }
		).then(data => {
			RetData.RetType = 'success';
			res.json(RetData);
		}).catch(e => {
			RetData.RetType = 'error';
			res.json(RetType);
		})
	await ActivityHelper.save({
		createData: {
			action: tokenCounts + 'Token Burnt',
			from: tokenOwner,
			tokenCounts: tokenCounts,
			activity: 'Token Burnt'
		}
	});
}

export const CountGet = async (req, res) => {
	var counts = await TokenIdtableDb.findOne({}).sort({ tokenId: -1 });
	if (counts == null) {
		var tok = new TokenIdtableDb({
			tokenId: 20000
		})
		tok.save()
			.then(data => {
				// console.log(data)
				res.json(data);
			})
	}
	else {
		TokenIdtableDb.findOneAndUpdate({ "tokenId": counts.tokenId }, { "$set": { "tokenId": counts.tokenId + 1 } })
			.then((data) => {
				res.json(data);
			})
			.catch((e) => {
				return res.json(e);
			})
	}
}

export const LikeList = async (req, res) => {
	var retRes = {};
	retRes.toast = {};
	var reqBody = req.body;
	let useraddress = reqBody.currAddr;

	var data = {};
	data.tableName = LikeDb;
	data.findData = { "useraddress": useraddress }
	data.selectData = { "tokenCounts": 1 };
	var resp = await MongooseHelper.find(data);
	retRes = resp;
	return res.json(retRes);
}

export const Like = async (req, res) => {
	var retRes = {};
	retRes.toast = {};
	var reqBody = req.body;
	var tokenOwner = reqBody.tokenOwner;
	var tokenCounts = reqBody.tokenCounts;
	var useraddress = reqBody.currAddr;

	var data = {};
	data.tableName = LikeDb;
	data.findData = { "tokenCounts": tokenCounts, "useraddress": useraddress }
	var resp = await MongooseHelper.findOne(data);

	if (typeof resp.record == 'undefined') {
		res.json(resp);
	}
	else if (resp.record == null) {
		retRes.likeOrUnlike = 'like';

		var data = {};
		data.tableName = LikeDb;
		data.createData = { "tokenCounts": tokenCounts, "useraddress": useraddress }
		var resp = await MongooseHelper.save(data);
		retRes.likeData = resp;

		if (resp.record) {
			var data = {};
			data.tableName = TokenDb;
			data.findData = { tokenCounts: tokenCounts, tokenOwner: tokenOwner }
			data.updateData = { $inc: { likecount: 1 } };
			data.newormulti = { new: true };
			var resp = await MongooseHelper.findOneAndUpdate(data);
			if (resp.record) {
				retRes.tokenData = resp;
				retRes.toast.type = 'success';
				retRes.toast.msg = 'Token like successfully';

				await ActivityHelper.save({
					createData: {
						action: retRes.likeOrUnlike,
						from: useraddress,
						tokenCounts: tokenCounts
					}
				});
				return res.json(retRes);
			}
			else {
				return res.json(retRes);
			}
		}
		else {
			return res.json(retRes);
		}
	}
	else {
		retRes.likeOrUnlike = 'unlike';

		var data = {};
		data.tableName = LikeDb;
		data.findData = { "tokenCounts": tokenCounts, "useraddress": useraddress }
		var resp = await MongooseHelper.findOneAndRemove(data);
		retRes.likeData = resp;

		if (resp.record) {
			var data = {};
			data.tableName = TokenDb;
			data.findData = { tokenCounts: tokenCounts, tokenOwner: tokenOwner }
			data.updateData = { $inc: { likecount: -1 } }
			data.newormulti = { new: true };
			var resp = await MongooseHelper.findOneAndUpdate(data);
			if (resp.record) {
				retRes.tokenData = resp;
				retRes.toast.type = 'success';
				retRes.toast.msg = 'Token unlike successfully';

				await ActivityHelper.save({
					createData: {
						action: retRes.likeOrUnlike,
						from: useraddress,
						tokenCounts: tokenCounts,
						activity: 'Liked by'
					}
				});

				return res.json(retRes);
			}
			else {
				return res.json(retRes);
			}
		}
		else {
			return res.json(retRes);
		}
	}
}

export const TokenHashStatusChange = async (req, res, Addr) => {
	try {
		return await MyItemAddrDb.aggregate([
			{
				$match: {
					"currAddress": Addr,
					'status': { '$ne': 'true' }
				}
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
		]);
	}
	catch (err) {
		// console.log('err',err);
		return [];
	}
}
export const getHotBids = async (req, res) => {
	try {
		var data = await BiddingDb.aggregate([
			{
				$match: {
					"$and": [
						{
							"timestamp": {
								$lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
							},
							"microNft": { "$ne": true }
						}
					]
				}
			},
			{
				$group: { _id: "$tokenCounts", count: { $sum: 1 } }
			},
			{
				$sort: { count: -1 }
			},
			{
				$lookup: {
					from: "tokenowners",
					localField: "_id",
					foreignField: "tokenCounts",
					as: "tokenownerslist"
				}
			},

			{
				$unwind: {
					path: "$tokenownerslist",
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$lookup: {
					from: "tokens",
					localField: "tokenownerslist.tokenCounts",
					foreignField: "tokenCounts",
					as: "tokenownerslist.curr"
				}
			},
			{
				$unwind: {
					path: "$tokenownerslist.curr",
					preserveNullAndEmptyArrays: true
				}
			}
		])
		return res.json({
			success: true,
			list: data,
		});
	} catch (error) {
		return res.json({
			err: error	,
			success: false,
			msg: "Error on server",
		});
	}
}
export const getItems_collectiblesList = async (req, res) => {
	var filter = {}, sort = {}, limit, toPrice = 0, putonsalefilter = {};
	if (req.body && req.body.categoryFilter && req.body.categoryFilter !== 'All') filter = { tokenCategory: req.body.categoryFilter };
	if (req.body && req.body.sortPrice) sort = { tokenPrice: (req.body.sortPrice == 'high' ? 1 : -1) };
	if (req.body && req.body.sortLike) sort = { ...sort, likecount: (req.body.sortLike == 'most' ? 1 : -1) };
	if (req.body && req.body.PutOnSale) putonsalefilter = { PutOnSaleType: req.body.PutOnSale }
	if (req.body && req.body.limit) limit = req.body.limit;
	if (req.body && req.body.range && req.range.to) toPrice = req.range.to;
	try {
		// console.log('Req,,,,,>>', req);
		var data = await TokenDb.aggregate(
			[
				{ $match: putonsalefilter },
				{ $limit: limit },
				{ $sort: sort },
				{
					$lookup: {
						from: "users",
						localField: "tokenOwner",
						foreignField: "curraddress",
						as: "userdata"
					}
				}, {
					$unwind: {
						path: '$userdata',
						preserveNullAndEmptyArrays: true,
					}
				},
				{
					$lookup: {
						from: "bidings",
						localField: "tokenCounts",
						foreignField: "tokenCounts",
						as: "biding"
					}
				}, {
					$unwind: {
						path: '$biding',
						preserveNullAndEmptyArrays: true,
					}
				}
			])
		return res.json({
			success: true,
			list: data,
		});
	}
	catch (err) {
		return res.json({
			err: err,
			success: false,
			msg: "Error on server",
		});
	}
}

export const getBuyerSeller = async (req, res) => {
	var ReqBody = req.body, obj = {}, timeObj = {};
	console.log("<<<<<<REQBOy", ReqBody)
	if (ReqBody.buyerSellerFilter == 'buyer')
		obj = {
			"_id": "$from",
			"created": { "$first": "$created" }, "action": { "$first": "$action" },
			"count": { "$sum": 1 }
		};

	if (ReqBody.buyerSellerFilter == 'seller')
		obj = {
			"_id": "$to",
			"created": { "$first": "$created" }, "action": { "$first": "$action" },
			"count": { "$sum": 1 }
		};

	if (ReqBody.buyerSellerTimeFilter == 'today')
		timeObj = {
			$and: [
				{ created: { $gte: new Date(Date.now() - (24 * 60 * 60 * 1000)) } },
				{ action: 'buyerseller' }
			]
		}

	if (ReqBody.buyerSellerTimeFilter == 'yesterday')
		timeObj = {
			$and: [
				{ created: { $gte: new Date(Date.now() - ((24 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000))) } },
				{ action: 'buyerseller' }
			]
		}

	if (isEmpty(timeObj))
		timeObj = {
			$and: [
				{ created: { $gte: new Date(Date.now() - ((24 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000))) } },
				{ action: 'buyerseller' }
			]
		}

	if (isEmpty(obj)) {
		obj = {
			"_id": "$from",
			"created": { "$first": "$created" }, "action": { "$first": "$action" },
			"count": { "$sum": 1 }
		};
	}
	try {
		var query = [
			{
				$match: timeObj
			},
			{
				"$group": obj

			},
			{
				"$sort": { "count": -1 }
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "curraddress",
					as: "users"
				}
			},
			{
				$unwind: {
					path: "$users"
				}
			},
			{
				$lookup: {
					from: "tokenowners",
					localField: "users.curraddress",
					foreignField: "tokenOwner",
					as: "bidings"
				}
			},

			{
				$lookup: {
					from: "tokens",
					localField: "bidings.tokenCounts",
					foreignField: "tokenCounts",
					as: "token"
				}
			},
			{
				$unwind: {
					path: "$bidings"
				}
			},
			{
				$unwind: {
					path: "$token"
				}
			},
			{
				$match: { 'bidings.balance': { $ne: 0 } }
			},
			{
				$group: { "_id": "$token.tokenCounts", "users": { "$first": "$users" }, "bidings": { "$first": "$bidings" }, "token": { "$first": "$token" } }
			}
		];
		console.log(">>>>>>>query", JSON.stringify(query));
		var data = await ActivityDb.aggregate(query);
		return res.json({
			success: true,
			list: data,
		});
	} catch (err) {
		return res.json({
			err: err,
			success: false,
			msg: "Error on server",
		});
	}
}



export const getOwners = async (req, res) => {
	try {
		// console.log("TokenCounts : ", req.body.tokenCounts);
		var data = await TokenDb.aggregate([
			{ "$match": { tokenCounts: req.body.tokenCounts } },
			{
				$lookup:
				{
					from: "tokenowners",
					localField: "tokenCounts",
					foreignField: "tokenCounts",
					as: "tokenowners"
				}
			},
			{
				$lookup:
				{
					from: "users",
					localField: "curraddress",
					foreignField: "tokenOwner",
					as: "userdata"
				}
			}
		])
		// console.log(JSON.stringify(data));
		return res.json({
			success: true,
			list: data,
		});
	} catch (err) {
		return res.json({
			err: err,
			success: false,
			msg: "Error on server",
		});
	}
}
export const MyItems_CollectiblesList = async (req, res) => {
	var RetData = {};
	var ReqBody = req.body;

	var Addr = ReqBody.Addr;
	var Target = ReqBody.Target;
	var TabName = ReqBody.TabName;

	if (ReqBody.init == true) {
		var changeStatusList = await TokenHashStatusChange(req, res, Addr);
		RetData.changeStatusList = changeStatusList;
	}

	let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
	let page = ReqBody.page ? parseInt(ReqBody.page) : 1;
	let skip = (page - 1) * limit;

	var data = {};
	data.limit = limit;
	data.skip = skip;
	data.initial = {
		status: 'true'
	};
	data.tokenowners_current = {
		'tokenowners_current.balance': { '$ne': 0 }
	}

	if (TabName == 'onsale') {
		data.tokenowners_current['tokenowners_current.tokenOwner'] = String(Addr);
		data.tokenowners_current['tokenowners_current.tokenPrice'] = { '$ne': 0 };
		// data.tokenowners_current = {
		// 	"$or" : [
		// 		{
		// 			"$and" : [
		// 				{ 
		// 					'tokenowners_current.tokenOwner' : String(Addr),
		// 					'tokenowners_current.tokenPrice' : {'$ne': 0 },
		// 					'tokenowners_current.tokenPrice' : {'$ne': null }
		// 				}
		// 			]
		// 		},
		// 		{
		// 			'nftType' : { '$ne': 'micro' }
		// 		}
		// 	]
		// }
	}
	else if (TabName == 'collectibles') {
		data.tokenowners_current['tokenowners_current.tokenOwner'] = String(Addr);
	}
	else if (TabName == 'created') {
		// data.tokenowners_initial.tokenCreator = String(Addr);
		data.tokenowners_current.tokenCreator = String(Addr);
	}
	else if (TabName == 'owned') {
		data.tokenowners_current['tokenowners_current.tokenOwner'] = String(Addr);
	}
	else if (TabName == 'liked') {
		var passdata = {};
		passdata.tableName = LikeDb;
		passdata.findData = { "useraddress": String(Addr) }
		passdata.selectData = {
			"tokenCounts": 1,
			_id: 0
		};
		var resp = await MongooseHelper.find(passdata);
		if (resp.records && resp.records.length > 0) {
			data.initial['$or'] = resp.records;
		}
		else {
			return res.json({
				from: 'My-Items',
				Target: Target,
				success: true,
				list: [],
			});
		}
	}
	data.extraFilter = {
		"tokenowners_current.balance": {
			"$ne": 0
		}
	};
	data.ReqBody = ReqBody;
	RetData = await ItemDetailList(data);
	RetData.from = 'My-Items';
	return res.json(RetData);
}

export const Home_CollectiblesList = async (req, res) => {
	var RetData = {};
	var ReqBody = req.body;
	// console.log('ReqBody Range>>>',ReqBody);
	let CatName = (ReqBody.CatName && ReqBody.CatName != 'All') ? ReqBody.CatName : '';
	var data = {};

	let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
	let page = ReqBody.page ? parseInt(ReqBody.page) : 1;
	let skip = (page - 1) * limit;
	let sortPrice = (ReqBody.sortPrice) ? ReqBody.sortPrice : '';
	let sortLike = (ReqBody.sortLike) ? ReqBody.sortLike : '';

	// console.log('>>>>>>>sort1',sortPrice);
	// console.log('>>>>>>>sort',sortLike);
	var priceSort = {}, likeSort = {};
	if (sortPrice === 'high')
		priceSort = { 'tokenPrice': 1 }
	if (sortPrice === 'low') {
		priceSort = { 'tokenPrice': -1 }
	}
	if (sortLike === 'most') {
		likeSort = { 'likecount': -1 }
	} if (sortLike === 'least') {
		likeSort = { 'likecount': 1 }
	}

	if (sortLike || sortPrice)
		data.sort = { ...likeSort, ...priceSort }

	if (!isEmpty(ReqBody.timestamp)) {
		data.sort = { "timestamp": (ReqBody.timestamp === 'long') ? 1 : -1 }
	}

	console.log('>>>>data.sort', data.sort)

	data.limit = limit;
	data.skip = skip;

	data.initial = {
		"$and": [
			{
				"$and": [
					{
						// "tokenOwner": {"$ne": req.body.currAddr},
						"status": "true",
						'tokenCategory': CatName ? CatName : { '$ne': '' }
					}
				]
			}
		]
	};
	if (!isEmpty(ReqBody.catname)) {
		data.initial = {
			"$and": [
				{
					"$and": [
						{
							// "tokenOwner": {"$ne": req.body.currAddr},
							"status": "true",
							'tokenCategory': ReqBody.catname ? ReqBody.catname : { '$ne': '' }
						}
					]
				}
			]
		}
	}
	if (!isEmpty(ReqBody.sellingType)) {
		data.initial = {
			"$and": [
				{
					"$and": [
						{
							// "tokenOwner": {"$ne": req.body.currAddr},
							"status": "true",
							'PutOnSaleType': ReqBody.sellingType === 'auction' ? { '$regex': new RegExp('Auction') } : { '$eq': 'FixedPrice' }
						}
					]
				}
			]
		}
	}

	data.tokenowners_current = {
		"$and":
			[
				{
					"tokenowners_current.balance": { "$ne": 0 },
					"microNft": { "$ne": true }
				}
			]
	}
	if (!isEmpty(ReqBody.rangeFilter) && parseFloat(ReqBody.rangeFilter) > 0.01)
		data.tokenowners_current = {
			"$and": [
				{
					'tokenowners_current.tokenPrice': { '$gte': parseFloat(ReqBody.rangeFilter) },
					"tokenowners_current.balance": { "$ne": 0 },
					"microNft": { "$ne": true }
				},
			]
		}
	data.extraFilter = {
		"$or": [
			{
				"$and": [
					{
						//               "tokenowners_current.tokenPrice": {
						//                 "$gt": 0
						//               },
						"tokenowners_current.PutOnSale": {
							"$ne": false
						},
						"$or": [
							{
								"PutOnSaleType": {
									"$ne": "UnLimitedAuction"
								},
								"PutOnSaleType": {
									"$ne": "TimedAuction"
								}
							}
						],
						"microNft": {
							"$ne": true
						}
					}
				]
			},
			{
				"nftType": "micro",
				"tokenowners_current.balance": {
					"$ne": 0
				}
			}
		]
	};
	data.ReqBody = ReqBody;

	RetData = await ItemDetailList(data);
	RetData.from = 'token-collectibles-list-home';
	return res.json(RetData);
}

export const Follow_CollectiblesList = async (req, res) => {
	var ReqBody = req.body;
	var RetData = {};
	var target = ReqBody.target;
	var addr = ReqBody.addr;

	var FindData = {};
	var SelectData = {};
	if (target == 'following') {
		FindData.follower = addr;
		SelectData.owner = 1;
	} else if (target == 'follower') {
		FindData.owner = addr;
		SelectData.follower = 1;
	}

	FollowDb.find(FindData, SelectData)
		.then(async (data) => {
			if (data.length == 0) {
				res.json({ list: [] });
			}
			else {
				var AllAddr = [];
				for (let i = 0; i < data.length; i++) {
					const element = data[i];
					if (target == 'following' && element.owner) {
						AllAddr.push(element.owner);
					} else if (target == 'follower' && element.follower) {
						AllAddr.push(element.follower);
					}
				}

				let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
				let page = ReqBody.page ? parseInt(ReqBody.page) : 1;
				let skip = (page - 1) * limit;

				var data = {};
				data.limit = limit;
				data.skip = skip;
				data.initial = { tokenCreator: { '$in': AllAddr } };
				data.tokenowners_current = {
					'tokenowners_current.balance': { '$ne': 0 }
				}
				data.ReqBody = ReqBody;

				RetData = await ItemDetailList(data);
				RetData.from = 'following';
				return res.json(RetData);
			}
		})
		.catch((e) => {
			res.json({ "err ": e, list: [] })
		})
}

async function ItemDetailList(data) {
	// console.log('Data range>>',data.range);
	if (data.sort === undefined)
		data.sort = { "timestamp": -1 };
	var Query = [
		{
			$match: data.initial
		},
		{
			$lookup:
			{
				from: "tokenowners",
				localField: "tokenCounts",
				foreignField: "tokenCounts",
				as: "tokenowners_current"
			},
		},
		// {
		// 	$lookup:
		// 	{
		// 		from: "bidings",
		// 		localField: "tokenCounts",
		// 		foreignField: "tokenCounts",
		// 		as: "bidingsList"
		// 	},
		// },
		{
			$unwind: {
				path: '$tokenowners_current',
				preserveNullAndEmptyArrays: true,
			}
		},
		// {
		// 	$unwind: {
		// 		path: '$bidingsList',
		// 		preserveNullAndEmptyArrays: true,
		// 	}
		// },
		{ $match: data.tokenowners_current },
		{ $sort: data.sort },
		{ $skip: data.skip },
		{ $limit: data.limit },
		{
			$match: data.extraFilter
		},
		{
			$lookup: {
				from: "users",
				localField: "tokenCreator",
				foreignField: "curraddress",
				as: "tokencreatorinfo"
			},
		},
		// {
		// 	$match :  data.range
		// },
		{
			$unwind: {
				path: '$tokencreatorinfo',
				preserveNullAndEmptyArrays: true,
			}
		},
		{
			$lookup: {
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
			$lookup: {
				from: "users",
				localField: "tokenowners_current.tokenOwner",
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
				tokenowners_current: 1,
				ipfsimage: 1,
				additionalImage: 1,
				bidingsList: 1,
				verifyNft: 1,
				verified: 1,
				tokenOwnerInfo: {
					_id: "$tokenuser._id",
					image: "$tokenuser.image",
					name: "$tokenuser.name",
					curraddress: "$tokenuser.curraddress",
					customurl: "$tokenuser.customurl"
				},
				tokenCreatorInfo: {
					_id: "$tokencreatorinfo._id",
					image: "$tokencreatorinfo.image",
					name: "$tokencreatorinfo.name",
					curraddress: "$tokencreatorinfo.curraddress",
					customurl: "$tokencreatorinfo.customurl"
				},
				usercontract: {
					imageUser: "$usercontract.imageUser",
					type: "$usercontract.type",
					name: "$usercontract.name",
					url: "$usercontract.url",
					conAddr: "$usercontract.conAddr"
				}
			}
		}
	];

	var Target = '';
	if (data.ReqBody && data.ReqBody.Target) {
		Target = data.ReqBody.Target;
	}
	if (Target == 'Count') {
		Query.push({ $count: "count" });
	}
	try {
		console.log('>>>>QueryItemDetials', JSON.stringify(Query));
		var data = await TokenDb.aggregate(Query);
		return {
			Target: Target,
			success: true,
			list: data,
		};
	}
	catch (err) {
		return {
			err: err,
			success: false,
			msg: "Error on server",
		};
	}
}

export const CategoryList = async (req, res) => {
	var retJson = {};
	var reqQuery = req.query;
	let limit = reqQuery.limit ? parseInt(reqQuery.limit) : Config.limitMax;

	CategoryDb.find({})
		.limit(limit)
		.exec(function (err, data) {
			if (err) {
				retJson = {
					success: false,
					msg: "Error on server",
					from: 'tokenCategoryList'
				};
				return res.status(200).json(retJson);
			} else {
				retJson = {
					success: true,
					list: data,
					from: 'tokenCategoryList'
				};
				return res.status(200).json(retJson);
			}
		});
}

export const AddItemValidation = async (req, res) => {
	var retJson = {};
	var reqBody = req.body;
	var errors = {};
	// console.log('reqBodyAddItemValidation', reqBody);

	var data = {};
	data.tableName = TokenDb;
	data.findData = { "tokenName": reqBody.TokenName }
	data.selectData = { "tokenName": 1 };
	var resp = await MongooseHelper.findOne(data);

	if (resp.record) {
		errors.TokenName = "Name Exits";
	}
	retJson.errors = errors;
	return res.status(200).json(retJson);
}
export const AddCollection = async (req, res) => {
	var ReqBody = req.body;
	// console.log('asdasdasdasdasdasdasdasddasdasdasddasd',ReqBody);
	var ReqFiles = req.files;
	var ImageName = (typeof ReqFiles.file !== "undefined") ? Date.now() + ReqFiles.file.name : "";
	var postData = {
		image: ImageName,
		name: ReqBody.name,
		symbol: ReqBody.symbol,
		shortUrl: ReqBody.shortUrl,
		description: ReqBody.description,
		type: ReqBody.type,
		conAddr: ReqBody.conAddr
	}
	var TokenNew = new Collection(postData);

	var data = TokenNew.save();
	// console.log('>>>>>>',data);
	if (data) {
		fs.mkdir('public/collections/', { recursive: true }, function (err) {
			if (err) {
				// console.log('mkdir err',err)
				return;
			}
		});
		if (ImageName != "" && ReqFiles && ReqFiles.file) {
			var UploadFullPath = 'public/collections/' + ImageName;
			ReqFiles.file.mv(UploadFullPath, function (err) {
				if (err) {
					// console.log('mv err',err,UploadFullPath);
					return;
				}
			});
		}
	}
	res.json({ RespType: "success" });
}

export const AddItem = async (req, res) => {
	var ReqBody = req.body;
	var ReqFiles = req.files;
	const { data, name, mimetype } = ReqFiles.Image;
	const timestamp = new Date().toISOString();
	if (mimetype != 'video/mp4') {
		var ref = `${timestamp}.webp`;
	} else {
		var ref = `${timestamp}.mp4`;
	}
	console.log('ReqFiles', ReqFiles);
	console.log('ReqBody>>>>>>>>additem', ReqBody);
	var Name = ReqBody.Name;
	var Count = ReqBody.Count;
	var Description = ReqBody.Description;
	var Price = ReqBody.Price;
	var Royalities = ReqBody.Royalities;
	var Category = ReqBody.Category_label;
	var Bid = ReqBody.Bid;
	var Properties = ReqBody.Properties;
	var Owner = ReqBody.Owner;
	var Creator = ReqBody.Creator;
	var CategoryId = ReqBody.CategoryId;
	var Quantity = ReqBody.Quantity;
	var Balance = ReqBody.Balance;
	var ContractAddress = ReqBody.ContractAddress;
	var Status = ReqBody.Status;
	var HashValue = ReqBody.HashValue;
	var Type = ReqBody.Type;
	var MinimumBid = ReqBody.MinimumBid;
	var EndClocktime = ReqBody.EndClocktime;
	var ipfsimage = ReqBody.ipfsimage;
	var UnLockcontent = ReqBody.UnLockcontent;
	var microNft = ReqBody.microNft;
	var nftType = ReqBody.nftType;
	var Link = ReqBody.Link;
	var verifyNft = ReqBody.verifyNft;
	var ImageName = (typeof ReqFiles.Image !== "undefined") ? ReqFiles.Image.name : "";
	var compressImage = (typeof ReqFiles.compressImage !== "undefined") ? ReqFiles.compressImage.name : "";
	var NewItem = {
		tokenCounts: Count,
		tokenName: Name,
		tokenDesc: Description,
		tokenPrice: Price,
		tokenRoyality: Royalities,
		tokenCategory: Category,
		tokenBid: Bid,
		tokenProperty: Properties,
		tokenOwner: Owner,
		tokenCreator: Creator,
		categoryid: CategoryId,
		tokenQuantity: Quantity,
		balance: Balance,
		contractAddress: ContractAddress,
		status: Status,
		hashValue: HashValue,
		type: Type,
		minimumBid: MinimumBid,
		ipfsimage: ipfsimage,
		unlockcontent: UnLockcontent,
		microNft: microNft,
		nftType: nftType,
		image: ImageName,
		Link: Link,
		verifyNft: verifyNft,
		additionalImage: ref
	}

	if (ReqBody.Clocktime) {
		NewItem.clocktime = ReqBody.Clocktime;
	}
	if (ReqBody.EndClocktime) {
		NewItem.endclocktime = ReqBody.EndClocktime;
	}

	if (typeof ReqBody.PutOnSale != 'undefined') {
		NewItem.PutOnSale = ReqBody.PutOnSale;
	}
	if (typeof ReqBody.PutOnSaleType != 'undefined') {
		NewItem.PutOnSaleType = ReqBody.PutOnSaleType;
	}

	var TokenNew = new TokenDb(NewItem);
	// console.log('TokenNew',TokenNew)
	var additionalFile = "nftImg/compressedImage/" + TokenNew.tokenCreator + '/' + ref;
	var tokendata = TokenNew.save();
	var UploadFullPath = 'public/nftImg/' + TokenNew.tokenCreator + '/' + ImageName;
	if (tokendata) {
		await fs.mkdir('public/nftImg/' + TokenNew.tokenCreator, { recursive: true }, function (err) {
			// console.log('mkdir err',err,TokenNew.tokenCreator)
			if (err) return;

			if (ImageName != "" && ReqFiles && ReqFiles.Image) {
				ReqFiles.Image.mv(UploadFullPath, function (err) {
					// console.log('mv err',err,UploadFullPath);
					if (err) return;
				});
			}
		});
		await fs.mkdir("public/nftImg/compressedImage/" + TokenNew.tokenCreator, { recursive: true }, function (err) {
			if (err) return;
			//File compression concepts here 
			var restrictImageFiles = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png', , 'image/webp', 'image/JPG', 'image/JPEG', 'image/PNG', 'image/GIF', 'image/WEBP']; // add relevent types here haha
			if (restrictImageFiles.includes(mimetype)) {
				sharp(data, { animated: true })
					// .resize({ width: 500 })
					.webp({ quality: 80 })
					.toFile("public/" + additionalFile)
					.then((data) => {
						console.log('dataa>>>>', data);
					})
					.catch(error => {
						console.log('dataa>>>>', error);
					});
			}
			var restrictVideoType = ['video/mp4']; // add relevent types here haha
			if (restrictVideoType.includes(mimetype)) {
				ffmpeg(UploadFullPath)
					.setStartTime('00:00:01')
					.setDuration(5)
					.output('public/nftImg/compressedImage/' + TokenNew.tokenCreator + "/" + ref)
					.on('end', function (err) {
						if (!err) {
							console.log('successfully converted', data);
						}
					})
					.on('error', function (err) {
						console.log('conversion error: ', err);
					}).run();
			}
		});

		res.json({ RespType: "success", RespData: tokendata });
	}
}

export const AddOwner = async (req, res) => {
	var ReqBody = req.body;

	var Count = ReqBody.Count;
	var Owner = ReqBody.Owner;
	var Price = ReqBody.Price;
	var Balance = ReqBody.Balance;
	var Quantity = ReqBody.Quantity;

	var ContractAddress = ReqBody.ContractAddress;
	var HashValue = ReqBody.HashValue;
	var Status = ReqBody.Status;
	var Type = ReqBody.Type;
	var PutOnSale = ReqBody.PutOnSale;

	var TokenOwnerNew = new TokenOwnerDb({
		tokenCounts: Count,
		tokenOwner: Owner,
		tokenPrice: Price,
		balance: Balance,
		quantity: Quantity,
		contractAddress: ContractAddress,
		hashValue: HashValue,
		status: Status,
		type: Type,
		PutOnSale: PutOnSale
	})
	TokenOwnerNew.save()
		.then((data) => {
			res.json({ "RespType": "success", RespData: data });
		})
		.catch((err) => {
			res.json({ RespType: "error", err: err });
		})

	await ActivityHelper.save({
		createData: {
			action: Count + ' Token count Added',
			from: Owner,
			tokenCounts: Count,
			activity: 'Token count Added'
		}
	});
}
export const AddActivity = (req, res) => {
	var ReqBody = req.body;
	var from = ReqBody.from;
	var to = ReqBody.to;
	var action = ReqBody.action;

	var activityList = new ActivityDb({
		from: from,
		action: action,
		to: to
	})
	activityList.save().then((data) => {
		res.json({ "RespType": "success", RespData: data });
	})
		.catch((err) => {
			res.json({ RespType: "error", err: err });
		})
	// res.json({ RespType: "error", err: 'Error occurs' });
}

export const MicroownerValidation = async (req, res) => {
	console.log('req>>>', req.body)
	try {
		var ReqBody = req.body;
		var tokenCount = ReqBody.tokenCount
		var name = ReqBody.name;
		var symbol = ReqBody.symbol;
		var decimal = ReqBody.decimal;
		var slot = ReqBody.slot;
		var exchangeAddress = ReqBody.exchangeAddress;
		var adminAddress = ReqBody.adminAddress;

		var microOwnership = new MicroownershipDB({
			tokenCount: tokenCount,
			name: name,
			symbol: symbol,
			decimal: decimal,
			slot: slot,
			exchangeAddress: exchangeAddress,
			adminAddress: adminAddress
		})
		microOwnership.save().then((data) => {
			res.json({ "RespType": "success", RespData: data });
		})
			.catch((err) => {
				res.json({ "RespType": "error", err: err });
			})
	} catch (err) {
		res.json({ "RespType": "error", err: err });
	}
}

export const getLatestList = async (req, res) => {
	// console.log('>>getLatestList');
	try {
		var data = await TokenOwnerDb.aggregate([
			{
				$sort: { 'timestamp': -1 }
			},
			{
				$lookup: {
					from: "tokens",
					localField: "tokenCounts",
					foreignField: "tokenCounts",
					as: "tokenowners_current"
				}
			},
			{
				$match: {
					"$or": [
						{
							"$and":
								[
									{
										"tokenowners_current.balance": { "$ne": 0 },
										"tokenowners_current.microNft": { "$ne": true },
										"$or": [{
											"tokenowners_current.PutOnSaleType": {
												"$ne": "UnLimitedAuction"
											},
											"tokenowners_current.PutOnSaleType": {
												"$ne": "TimedAuction"
											}
										}
										],
										'balance': { $ne: 0 },
										// 'tokenPrice' : { "$gt" : 0},
										'PutOnSale': { "$ne": false },
										"tokenowners_current.microNft": {
											"$ne": true
										}
									}
								]
						},
						{
							"tokenowners_current.nftType": 'micro',
							'balance': { $ne: 0 },
							"tokenowners_current.microNft": { "$ne": true },
						}
					]
				}
			},
			{
				$unwind: {
					path: "$tokenowners_current"
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "tokenOwner",
					foreignField: "curraddress",
					as: "users"
				}
			},
			{
				$unwind: {
					path: "$users"
				}
			}
		])
		return res.json({
			success: true,
			list: data,
		});
	} catch (err) {
		return res.json({
			err: err,
			success: false,
			msg: "Error on server",
		});
	}
}
export const ipfsImageHashGet = async (req, res) => {

	var ReqFiles = req.files;
	// console.log('filesssssssssssssssssssssssssssssssss',req.files)
	const file = { path: 'vibranium', content: Buffer.from(req.files.Image.data) }
	const filesAdd = await ipfs.add(file)

	// console.log("filesssssssssssssssssssssssssssssssss",filesAdd)
	var ipfsimage = filesAdd.cid.string;
	// console.log(ipfsimage)
	res.json({ ipfsval: ipfsimage })
}
export const getFaqLists = async (req, res) => {
	try {
		const data = await Faq.find({});
		return res.json({
			success: true,
			list: data,
		});
	} catch (error) {
		return res.json({
			success: false,
			list: error,
		});
	}
}
export const getcmslistinhome = async (req, res) => {

	var data = await cmsnew.findOne({ "load": req.body.load })
	//console.log("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111", soci)
	if (data) {
		res.json({ data: data })
	}
	else {
		res.json({})
	}
}
export const faqlists = async (req, res) => {

	var soci = await Faq.find({})
	//console.log("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111", soci)
	if (soci) {
		res.json({ soci: soci })
	}
	else {
		res.json([])
	}
}

export const getMicroownershipList = async (req, res) => {
	var reqBody = req.body;
	console.log('dadaadaadadad', reqBody);
	if (reqBody.tokenCount)
		var filter = {
			$match: {
				tokenCount: { $eq: reqBody.tokenCount }
			}
		}
	else {
		var filter = {
			$match: {
				tokenCount: { $ne: -3 }
			}
		}
	}
	try {
		var data = await MicroownershipDB.aggregate([
			filter,
			{
				$lookup: {
					from: 'tokens',
					localField: 'tokenCount',
					foreignField: 'tokenCounts',
					as: 'tokenCurrent'
				}
			},
			{
				$unwind: {
					path: '$tokenCurrent',
					preserveNullAndEmptyArrays: true,
				}
			},
			{
				$lookup: {
					from: 'tokenowners',
					localField: 'tokenCount',
					foreignField: 'tokenCounts',
					as: 'ownerinfo'
				}
			},

			{
				$unwind: {
					path: '$ownerinfo',
					preserveNullAndEmptyArrays: true,
				}
			},
			{
				$match: { 'ownerinfo.balance': { '$ne': 0 } }
			},
			{
				$sort: { tokenCount: -1 }
			}
		])
		console.log('dataamicro>>', data);
		if (data) {
			return res.json({
				success: true,
				list: data
			});
		} else {
			return res.json({
				success: false,
				message: "No data Returns"
			});
		}
	} catch (error) {
		return res.json({
			success: false,
			message: error
		});
	}
}
export const BookingMicroSlot = async (req, res) => {
	try {
		var ReqBody = req.body;
		console.log(">>>booking", ReqBody);
		var buyerAddress = ReqBody.buyerAddress;
		var tokenCount = ReqBody.tokenCount;
		var buyerSlot = ReqBody.buyerSlot;
		var checkSlot = ReqBody.checkSlot;
		var availableslot = ReqBody.availableslot;
		var maxSlot = ReqBody.maxSlot;
		var microNft = ReqBody.microNft;
		var findOnly = ReqBody.findOnly;


		// var find = await MicroslotbookingDb.find({ tokenCount : tokenCount , buyerAddress : buyerAddress, buyerSlot : maxSlot})
		var find = await MicroslotbookingDb.aggregate([
			{
				$match: {
					$and: [
						{
							tokenCount: tokenCount,
							buyerAddress: buyerAddress
						}
					]
				}
			}
			,
			{ "$group": { _id: "$tokenCount", totalSlot: { $sum: "$buyerSlot" } } },
			{ $match: { "totalSlot": checkSlot } }
		])
		if (!isEmpty(find)) {
			return res.json({ find: true, msg: "Already buy a slot", data: find });
		}

		if (findOnly) {
			return res.json({ find: false, msg: "returnnn" });
		}

		var microupdateData = await TokenDb.findOneAndUpdate(
			{ tokenCounts: tokenCount },
			{
				microNft: microNft
			}
		);

		var microslotbooking = new MicroslotbookingDb({
			tokenCount: tokenCount,
			buyerAddress: buyerAddress,
			buyerSlot: buyerSlot,
			maxSlot: maxSlot
		})
		var data = await microslotbooking.save();
		if (data) {
			var updateData = await MicroownershipDB.findOneAndUpdate(
				{ tokenCount: tokenCount },
				{
					availableSlot: availableslot
				}
			);
			if (updateData)
				return res.json({ success: true, retData: updateData });
		}
		return res.json({ success: true, retData: data });
	} catch (error) {
		console.log('errormicroerror>>>', error);
		return res.json({ success: false, err: error });
	}
}
export const checkClaimShow = async (req, res) => {
	try {
		var ReqBody = req.body;
		var adminAddress = ReqBody.adminAddress;
		var tokenCounts = ReqBody.tokenCounts;
		var curAddr = ReqBody.curAddr;
		var data = await TokenDb.aggregate([
			{
				$match: {
					$and: [
						{
							tokenCounts: tokenCounts,
							nftType: 'micro'
						}
					]
				}
			},
			{
				$lookup: {
					from: 'tokenowners',
					"let": { "tokenCounts": "$tokenCounts" },
					"pipeline": [
						{
							"$match": {
								"$expr": { "$eq": ["$tokenCounts", "$$tokenCounts"] },
								"tokenOwner": { "$ne": adminAddress },
								"balance": { "$ne": 0 }
							}
						}
					],
					as: 'tokenowners'
				}
			},
			{
				$unwind: {
					path: '$tokenowners',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$lookup: {
					from: 'microownership',
					localField: 'tokenowners.tokenCounts',
					foreignField: 'tokenCount',
					as: 'microownership'
				}
			},
			{
				$unwind: {
					path: '$microownership',
					preserveNullAndEmptyArrays: true
				}
			}
		]);
		if (!isEmpty(data)) {
			var microbookslot = await MicroslotbookingDb.aggregate([
				{
					$match: {
						$and: [
							{
								tokenCount: tokenCounts,
								buyerAddress: curAddr,
								claim: false
							}
						]
					}
				}
				,
				{ "$group": { _id: "$tokenCount", count: { $sum: "$buyerSlot" } } }
			])
			return res.json({ success: true, list: data, microbookingslot: microbookslot });
		} else {
			return res.json({ success: false, message: "No data found" });
		}
	} catch (error) {
		return res.json({ success: false, error: error });
	}
}
export const tokenClaimed = async (req, res) => {
	try {
		var ReqBody = req.body;
		var tokenCount = ReqBody.tokenCount;
		var buyerAddress = ReqBody.buyerAddress;
		var updateClaimData = await MicroslotbookingDb.update(
			{ tokenCount: tokenCount, buyerAddress: buyerAddress },
			{ claim: true },
			{ multi: true });
		if (updateClaimData) {
			return res.json({ success: true, data: updateClaimData });
		} else {
			return res.json({ success: false, msg: 'No data found' });
		}
	} catch (error) {
		return res.json({ success: false, msg: 'No data found -- error' });
	}
}
export const IpfsMetadata = async (req, res) => {
	console.log("Metadata checking%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
	var newmetadata = {
		name: req.body.name,
		image: req.body.image,
		description: req.body.description
	}

	const file = { path: 'aidicraft', content: Buffer.from(JSON.stringify(newmetadata)) }


	const filesAdd = await ipfs.add(file)


	var ipfsmetadata = filesAdd.cid.string;
	console.log("MEtataadataaa", ipfsmetadata)
	res.json({ ipfsval: ipfsmetadata })
}
export const checkAdminCountperToken = async (req, res) => {
	try {
		var ReqBody = req.body;
		var adminAddress = ReqBody.adminAddress;
		var tokenCounts = ReqBody.tokenCounts
		console.log('adminaddressmicro', ReqBody);
		var data = await MicroslotbookingDb.aggregate([
			{
				$match: {
					$and: [
						{
							tokenCount: tokenCounts,
							buyerAddress: adminAddress,
							claim: false
						}
					]
				}
			}
			,
			{ "$group": { _id: "$tokenCount", totalSlot: { $sum: "$buyerSlot" } } }
		])
		if (data) {
			return res.json({ success: true, admindata: data.shift() });
		}
		return res.json({ success: true, data: {} });
	} catch (error) {
		return res.json({ success: false, error: error });
	}
}

export const imagecompression = async (req, res) => {
	var reqFiles = req.files;
	console.log('reqFiles', reqFiles.image);
	const { data, name } = reqFiles.image;
	const timestamp = new Date().toISOString();
	const ref = `${timestamp}.webp`;
	// sharp(data, { animated: true })
	// // .resize({ width: 500 })
	// .webp({ quality: 80 })
	// .toFile("public/nftImg/compressedImage/" + ref)
	// .then((data) => {
	// 	console.log('dataa>>>>', data);
	// })
	// .catch(error => {
	// 	console.log('dataa>>>>', error);
	// });
	ffmpeg('public/nftImg/compressedImage/0x4a2128db226bbaf11bf7846dfad3d9d7b9d014e6 9.mp4')
		.setStartTime('00:00:01')
		.setDuration(5)
		.output('public/nftImg/compressedImage/videofile.mp4')
		.on('end', function (err) {
			if (!err) {
				console.log('successfully converted', data);
			}
		})
		.on('error', function (err) {
			console.log('conversion error: ', err);
		}).run();
	return res.json({ success: true, message: 'Something happen' });
}
export const getMicroHistory = async (req, res) => {
	var ReqBody = req.body;
	console.log('getMicroHistory>>>>', ReqBody);
	try {
		var data = await MicroslotbookingDb.aggregate([
			{
				$match: { tokenCount: ReqBody.tokenCount }
			},
			{
				"$group": { _id: "$buyerAddress", totalSlot: { $sum: "$buyerSlot" } }
			},
			{
				$lookup: {
					from: 'users',
					localField: '_id',
					foreignField: 'curraddress',
					as: 'buyerAddressDetails'
				}
			},
			{
				$unwind: { path: '$buyerAddressDetails' }
			}
		])
		if (data) {
			return res.json({ success: true, list: data });
		} else {
			return res.json({ success: true, list: [] });
		}
	} catch (error) {
		return res.json({ success: false, error: error });
	}
}
export const getLauchVerifyData = async (req, res) => {
	try {
		var data = await TokenDb.aggregate([
			{
				$match: {
					"verified": true
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'tokenOwner',
					foreignField: 'curraddress',
					as: 'ownerdetails'
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'tokenCreator',
					foreignField: 'curraddress',
					as: 'creatordetails'
				}
			},
			{
				$unwind: { path: '$ownerdetails' }
			},
			{
				$unwind: { path: '$creatordetails' }
			}
		]);
		if (!isEmpty(data)) {
			return res.json({ success: true, list: data });
		} else {
			return res.json({ success: true, list: [] });
		}
	} catch (error) {
		return res.json({ success: true, error: "Error occured" });
	}
}
export const TransferComplete = async (req, res) => {
	var Datas = {}
	var RqBody = req.body;
	var userData = await UserDb.findOne({ 'curraddress': RqBody.UserAccountAddr })
	var findData = await TokenOwnerDb.findOne({
		'tokenCounts': RqBody.tokenCounts,
		'tokenOwner': RqBody.tokenOwner,
		'type': RqBody.tokenType,

	})

	var findDataSave = await TokenOwnerDb.findOne({
		'tokenCounts': RqBody.tokenCounts,
		'tokenOwner': RqBody.UserAccountAddr,
		'type': RqBody.tokenType,

	})
	if (userData == null) {
		var addDates = new UserDb({
			'_id': RqBody.UserAccountAddr,
			'curraddress': RqBody.UserAccountAddr
		})
		await addDates.save()
	}
	if (findDataSave == null) {
		var addDate = new TokenOwnerDb({
			tokenCounts: RqBody.tokenCounts,
			tokenOwner: RqBody.UserAccountAddr,
			tokenPrice: 0,
			balance: RqBody.NoOfToken,
			quantity: RqBody.NoOfToken,
			contractAddress: RqBody.contractAddress,
			hashValue: RqBody.transactionHash,
			status: "transfer",
			type: RqBody.tokenType,
			tokenCreator: RqBody.tokenCreator,
			burnToken: 0,
			previousPrice: 0
		})
		await addDate.save()
			.then((data) => {
				Datas.load = "success"
			})
	}
	else {
		await TokenOwnerDb.findOneAndUpdate({
			'tokenCounts': RqBody.tokenCounts,
			'tokenOwner': RqBody.UserAccountAddr,
			'type': RqBody.tokenType,

		},
			{
				"$set": {
					'balance': findDataSave.balance + RqBody.NoOfToken
				}
			}, {
			new: true
		}
		)
	}
	if (findData) {
		if (findData.balance == RqBody.NoOfToken) {
			await TokenOwnerDb.findOneAndUpdate({
				'tokenCounts': RqBody.tokenCounts,
				'tokenOwner': RqBody.tokenOwner,
				'type': RqBody.tokenType
			},
				{
					"$set": {
						'balance': 0
					}
				}, {
				new: true
			}).exec((err, data) => {
				if (err) console.log(err)
				Datas.updatelod = "success"
			})

		}
		else {
			await TokenOwnerDb.findOneAndUpdate({
				'tokenCounts': RqBody.tokenCounts,
				'tokenOwner': RqBody.tokenOwner,
				'type': RqBody.tokenType,
			},
				{
					"$set": {
						'balance': findData.balance - RqBody.NoOfToken
					}
				}, {
				new: true
			}).exec((err, data) => {
				if (err) console.log(err)
				data.updatelod = "success"
			})
		}
	}
	res.json(Datas)
}
export const getsettdata = async (req, res) => {
	SettingDB.findOne({}, (err, userData) => {
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