// import package
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const transactionchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'users',
    },
    fromaddress : {
        type: String,
        default:""
    },
    toaddress : {
        type: String,
        default:""
    },
	fromuserId : {
        type: String,
        default:""
    },
    touserId : {
		type: String,
		default:""
    },
    name: {
        type: String,
        default: ""
	},
	amount: {
        type: Number,
        default: 0
    },
	savid: {
        type: Number,
        default: 0 //this is sav id which is for user id who amount is transfer and who receives the amount
    },
    matrix : {
        type: Number,
        default: 3   //3 or 6 depends on the matrix
    },
    level : {
        type: Number,
        default: 0
    },
	transactionType : {
		type: String, 
		default: ""	 // Withdraw Deposit Admincommision Referal Purchase
    },
    adminfees : {
		type: Number, 
		default: 0	 // Admin fees for transaction
    },
    withdrawDeposit : {
		type: Number, 
		default: 1	 // 1 Deposit 2 Withdraw
	},
	currency: { 
		type: String, 
		default: ""
	},
	status: { 
		type : Number, 
        default : 1, //0-userpending  1-adminpending 2-adminapproved 3-admin rejects for withdraw                      
		index:true  //  1 approved for Deposit
	},
    transactionId: {
        type: String,
        default: ""  
    }, 
    reffrom: {
        type: Number,
        default: ""
    },  
    createdAt: {
        type: Date,
        default: Date.now
    },
    Remarks : {
        type: String,
    }
})

const Transaction = mongoose.model("Transaction", transactionchema,"Transaction");

export default Transaction;