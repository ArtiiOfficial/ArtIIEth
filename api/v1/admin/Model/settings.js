// var package
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');


// var lib
var config = require('../../../config/config');

const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
	Website: {
		type: String,
		default: ""
	},
	Instagram: {
		type: String,
		default: ""
	},
	Twitter: {
		type: String,
		default: ""
	},
	Telegram: {
		type: String,
		default: ""
	},
	Reddit: {
		type: String,
		default: ""
	},
	Discord: {
		type: String,
		default: ""
	},
	fields: {
		type: Array,
		default: []
	}
})

SettingsSchema.methods.generateJWT = function (payload) {
	var token = jwt.sign(payload, config.secretOrKey);
	return `Bearer ${token}`;
};

const Settings = mongoose.model("settings", SettingsSchema, "settings");
module.exports = Settings;