import express from "express";
import bcrypt from 'bcrypt';
import Userdata from "../model/Users.js";
import nodemailer from 'nodemailer';

const router = express.Router();

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahanthivikas965@gmail.com',
    pass: 'yohs ygkq adnf puak'
  }
});

router.post("/register", async (req, res) => {
    const { name = "", password = "", email = "", mobilenumber = "", bankname="", upipin="" } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    try {
        // Create user in the database
        const user = await Userdata.create({
            name,
            email,
            mobilenumber,
            bankname,
            upipin,
            "password" : hashedPassword
        });

        // Send registration confirmation email
        const mailOptions = {
            from: 'mahanthivikas965@gmail.com',
            to: email,
            subject: 'Registration Successful',
            text: `Hello ${name},\n\nThank you for registering with us!\nLogin Credentials:\nEmail : ${email}\nPassword : ${password}   `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.json(user);
    } catch (err) {
        console.log("error", err);
        res.json({ "error": "error creating data" });
    }
});

export default router;
