var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var walletSchema = new Schema({
  "user_id" :  {type:mongoose.Schema.Types.ObjectId,ref: 'users', index:true},
  "wallet" : [{
    "currencyid": { type: mongoose.Schema.Types.ObjectId, ref: 'currency', index:true},
    "currency": {type: String, default: ""},
    "amount": {type: Number, default: 0},
    "hold": {type: Number, default: 0},
    "margin": {type: Number, default: 0},
    "lending": {type: Number, default: 0},
    "margin_hold": {type: Number, default: 0},
    "lending_hold": {type: Number, default: 0},
  }]
});
module.exports = mongoose.model('userWallet', walletSchema, 'userWallet')
