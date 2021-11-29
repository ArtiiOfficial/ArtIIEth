const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let faq = new Schema({
	question:{
		type:String
	},
	answer:{
		type:String,
		required:true,
	},
	deleted : {
		type:Number,
		default:1,
	},
	created_date:{
		type:Date,
		default: Date.now
	},
});
module.exports = mongoose.model('faq',faq,'faq');
