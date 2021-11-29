import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const AlltransactionHistory = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    index: true,
  },
  currency: {
    type: String,
    index: true,
  },
  fromaddress: {
    type: String,
    default: "",
  },
  toaddress: {
    type: String,
    default: "",
  },
  transferType: {
    type: String,//Deposit Buy Withdraw invest
    default: "",
  },
  amount: {
    type: Number,
    default: 0,
  },
  email:{
    type: String,
  },
  txid: {
    type: String,
  },
  status: {
    type: String,
    default:1, //1-Completed
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});



const ALLTRANS = mongoose.model("AlltransactionHistory", AlltransactionHistory,"AlltransactionHistory");

export default ALLTRANS;


  