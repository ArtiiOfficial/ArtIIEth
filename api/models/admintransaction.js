// import package
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const admintransactionchema = new Schema({
	amount: {
        type: Number,
        default: 0
    },
    withdrawAddress : {
        type: String,
        default: 0
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
        default : 1, // 1 approved 0 failed
		index:true  
	},
    transactionId: {
        type: String,
        default: ""  
    },
    toaddress : {
        type: String,
        default: "" 
    },
    fromaddress : {
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

const Admintransaction = mongoose.model("Admintransaction", admintransactionchema,"Admintransaction");

export default Admintransaction;