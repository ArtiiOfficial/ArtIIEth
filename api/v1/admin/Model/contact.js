
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
var mongoose =require( 'mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let ContactSchema = new Schema({ 
	
  userid:{
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  contactname:{
  	type:String,
  	default:""
  },
  contactEmail:{
  	type:String,
  	default:""
  },
  subject:{
  	type:String,
  	default:""
  },
  message:{
    type:String,
  	default:""

  },
  replymsg:{
 type:String,
    default:""
  },
  createdAt: {
        type: Date,
        default: Date.now
    },
    replydate:{
      type: Date,
        default: Date.now
    }
})

const Support = mongoose.model("contact", ContactSchema,"contact");
module.exports= Support;