var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Withdraw = new Schema({
	"user_id"  		 : {type:mongoose.Schema.Types.ObjectId, ref: 'users', index:true},
	"withcurrency" : {type:mongoose.Schema.Types.ObjectId, ref: 'currency', index:true},
	"fromaddress"  : {type:String, default:''},
	"toAddress"		 : {type:String, default:''},
	"tag"					 : {type:String, default:''},
	"txid"				 : {type:String, default:'', index:true},
	"withamount"   : {type:String, default:0},
	"receiveamount": {type:Number, default:0},
	"status"			 : {type:String, default:0},//0-userPending,1-adminPending,2-completed,3-usercancel,4-admincancel
	"type" 				 : {type:String, default:0},//0-user,1-admin
	"fees"				 : {type:Number, default:0},
	"withType"		 : {type:String, default:0},//0-crypto, 1-fiat
	"reason": { type : String, default: '' },
	"timeexpire"	 : {type:Date},
	"datetime"		 : {type:Date, default: Date.now},
	"updatedatetime" : {type:Date, default: Date.now}
});
module.exports = mongoose.model('Withdraw', Withdraw, 'Withdraw')