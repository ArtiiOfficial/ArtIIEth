import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var addressSchema = new Schema({
	user_id: {type:mongoose.Schema.Types.ObjectId,ref: 'users',index:true},
	address: {type: String,default: "",index:true},
	private_key: {type: String,default: ""},
	tag: {type: String,default: ""},
	currency: {type: mongoose.Schema.Types.ObjectId,ref:'currency',index:true},
	currency_symbol: {type: String,default: ""},
	date: {type: Date, default: Date.now}
});


const CRYPTOADD = mongoose.model("crypto_address", addressSchema,"crypto_address");

export default CRYPTOADD;
