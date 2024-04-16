import express from "express";
import mongoose from "mongoose";
import UserRoute from "./Routes/UserRoute.js"
import RegisterRoute from "./Routes/Register.js"
import cors from 'cors';
import loginRoute from './Routes/Login.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

dotenv.config();
app.use(cors());
const dburl = "mongodb+srv://vikas:vikas965@cluster0.1vweadr.mongodb.net/?retryWrites=true&w=majority";
// const dburl = "mongodb+srv://vikas:vikas965@usercluster.1vweadr.mongodb.net/?retryWrites=true&w=majority";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
async function connectdb()
{
    try{

        await mongoose.connect(dburl);
        console.log('Connected To Database');
    }
    catch(err)
    {
        console.log(err.message);
    }
}

app.use('/Routes/Userimages', express.static(path.join(__dirname, 'Routes/Userimages')));


connectdb();

app.use(express.json());
app.use("/",RegisterRoute);
app.use("/",UserRoute);
app.use("/",loginRoute);

app.listen(3001,()=>{
    console.log("Server Connected");
})

