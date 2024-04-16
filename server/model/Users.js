import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name:String,
    password:String,
    email:String,
    mobilenumber: String,
    bankname:String,
    upipin:String,
    imagepath:String,
    accountbalance: { type: Number, default: 1000 },
    resetOTP: String,
})

const Userdata = mongoose.model("Userdata",UserSchema);

export default Userdata;