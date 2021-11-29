import express from 'express'
import path from 'path'
import currencyDB from '../models/currency'
import WalletDB from '../models/user_wallet'
import BalanceUpdation from '../models/BalanceUpdation'
import CryptoJS from 'crypto-js'
const app = express();
var router = express.Router();

let getbalance = exports.getbalance = function (userId, currency, callback) {
	WalletDB.findOne({ user_id: userId }, { wallet: { $elemMatch: { currencyid: currency } } }).exec(function (err, resdata1) {
		if (resdata1 && resdata1.wallet.length > 0) {
			callback(resdata1.wallet[0]);
			console.log(resdata1.wallet[0],' resdata1.wallet[0]----------------------')
		}
		else {
			currencyDB.findOne({_id:currency},{currencySymbol:1}).exec(function(currErr, currRes) {
				console.log("currRes", currRes)
				WalletDB.findOne({ user_id: (userId) }).exec(function (err, resdata1) {
					if (resdata1) {
						WalletDB.updateOne({ user_id: userId }, { $push: { "wallet": { "currencyid": currency, "currency": currRes.currencySymbol, "amount": 0, "margin": 0, "lending": 0, "margin_hold": 0, "lending_hold": 0, "hold": 0 } } }).exec((err, resDataw) => {
							WalletDB.findOne({ user_id: (userId) }, { wallet: { $elemMatch: { currencyid: currency } } }).exec(function (err, resdata2) {
								callback(resdata2.wallet[0]);
							})
						})
					}
					else {
						var createwallet = { "wallet": [], "user_id": userId };
						createwallet.wallet.push({ "currencyid": currency, "currency": currRes.currencySymbol, "amount": 0, "margin": 0, "lending": 0, "margin_hold": 0, "lending_hold": 0, "hold": 0 });
						WalletDB.create(createwallet, function (err_w, postres_w) {
								callback({ "currencyid": currency, "amount": 0, "margin": 0, "lending": 0, "margin_hold": 0, "lending_hold": 0, "hold": 0  });
						});
					}
				});
			})
		}
	});
};

let updateUserBalance = exports.updateUserBalance = function (userId, currId, amount, OldBal, LastId, type, callback) {
	var difference =parseFloat(amount) -parseFloat(OldBal);
	let referral = {
		userId: userId,
		currId: currId,
		amount: amount,
		difference: difference,
		OldBal: OldBal,
		LastId: LastId,
		Type: type
	}

	if(amount < 0){
		amount = 0
	}
	BalanceUpdation.create(referral, function (referErr, referRes) {
	})
	WalletDB.updateOne({ user_id: userId, "wallet.currencyid": currId }, { "$set": { "wallet.$.amount": +amount } }).exec(function (balErr, balRes) {
		if (balRes) {
			callback(balRes)
		} else {
			callback(false)
		}
	});
}


