import mongoose from "mongoose";

const Transactions = mongoose.Schema({
    sender:String,
    receiver:String,
    transid:String,
    amount: Number,
    timestamp: { type: Date, default: Date.now },
    
})

const Transdata = mongoose.model("Transactions",Transactions);

export default Transdata;