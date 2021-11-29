import mongoose from 'mongoose';

const Schema = mongoose.Schema;
let currency = new Schema({
	currencyName:{
		type: String, default: ''
	},
	currencySymbol:{
		type: String, default: ''
	},
	fee:{
		type: Number, default: 0
	},
	status:{
		type: String, default: 1, // 0 - deactive, 1-active
	},
	"curnType": { type: Number, default: 0 , index:true}, //0-crypto 1-fiat
	"image": { type: String, default: '' },
	"min_order": { type: Number, default: 0 },
	"krakenBalance": { type: Number, default: 0 },
	"minwithamt": { type: Number, default: 0 },
	"maxwithamt": { type: Number, default: 0 },
	"margin_status"    : { type: Number, default: 1 },//0-deactive 1-active
	"block": { type: Number, default: 0 },
	"EstimatedUSD": { type: Number, default: 0 },
	"EstimatedEUR": { type: Number, default: 0 },
	"EstimatedBRL": { type: Number, default: 0 },
	"feetype": { type: Number, default: 1 },// {0-amount,1-percentage}
	"status": { type: Number, default: 1 }, // {1-active,0-deactive}
	"decimals": { type: Number, default: 18 },
	"contractAddress": { type: String, default: '' , index:true},
	"currency_type": { type: Number, default: 1}, //0-token 1-coin
	'modified_date':{ type: Date, default:Date.now }
});

const Currency = mongoose.model("currency", currency,"currency");

export default Currency;

