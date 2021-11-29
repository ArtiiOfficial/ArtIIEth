const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let cmsnew = new Schema({
	question:{
		type:String
	},
	answer:{
		type:String,
		default:"",
	},
	load:{
		type:String,
		default:"",
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
module.exports = mongoose.model('cmsnew',cmsnew,'cmsnew');
