import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var ActivitySchema = mongoose.Schema({
        action: { type: String },
        from: { type: String },
        to: { type: String },
        tokenCounts: { type: Number },
        amount: { type: Number },
        fee: { type: Number },
        total: { type: Number },
        currencySymbol: { type: String },
        tokenSymbol: { type: String },
        activity:{tyoe:String},
        status: { type: String, default: 'new' },
        statusOpen: { type: String, default: 'new' },
        created: { type: Date, default: Date.now },
        // updated: { type: Date, default: Date.now },
});

var activityModal = mongoose.model("activity", ActivitySchema);
module.exports = activityModal;
