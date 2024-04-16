import express from "express";
import Userdata from "../model/Users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/userlogin",async (req,res)=>{
    try{
        const {email,password} = req.body;
    
    const registeredemail = await Userdata.findOne({email}); 
    if(!registeredemail){
        return res.json({"error" : "email doesnot exists"});
    }
    else{
        const exist = await bcrypt.compare(password,registeredemail.password);   
    if(!exist){
        return res.json({"message":"password incorrect"});
    }
    else{
        const token = jwt.sign({registeredemail},process.env.SECRET_KEY , {expiresIn : "3hr"}); 
        // console.log('token',token);
        return res.json({token})
    }
    }
    } catch(err){
        console.log("error",err);
    }
})

export default router;