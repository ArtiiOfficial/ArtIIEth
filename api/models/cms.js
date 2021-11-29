const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let cms = new Schema({
	identifier:{
		type:String
	},
	subject:{
		type:String,
		required:true,
	},
	content:{
		type:String,
		required:true,
	},
	deleted:{
		type:Number,
		default: 1
	},	
	created_date:{
		type:Date,
		default: Date.now
	},
	 image :[],
	 images:{
		 type:String
	 }
});

module.exports = mongoose.model('cms',cms,'cms');
