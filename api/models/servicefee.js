import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var servicefeeSchema = mongoose.Schema({
        servicefee: { type: Number },
      
});

var servicefeeModal = mongoose.model("servicefee", servicefeeSchema);
module.exports = servicefeeModal;
