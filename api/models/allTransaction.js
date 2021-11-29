// import package
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const allTransactionchema = new Schema({
	account: {
        type: String,
        default: 0
    },
    category : {
        type: String,
    },     
    amount : {
		type: Number, 
    },
    address : {
        type: String, 
    },
	vout: { 
		type: Number, 
	},
	fee: { 
		type : Number, 
	},
    confirmations: {
        type: Number,
    },
    bcconfirmations : {
        type: Number,
    },
    generated : {
        type: Boolean,
    },
    blockhash: {
        type: String,
    },  
    blockindex: {
        type: Number,
    },
    blocktime : {
        type: Number,
    },
    txid : {
        type: String,
    },
    walletconflicts : {
        type: Array,
    },
    time : {
        type: Number,
    },
    timereceived : {
        type: Number,
    },
})

const AllTransaction = mongoose.model("AllTransaction", allTransactionchema,"AllTransaction");

export default AllTransaction;