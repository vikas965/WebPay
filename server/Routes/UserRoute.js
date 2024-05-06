
import express from "express";
import Userdata from "../model/Users.js";
import multer from 'multer';
import path from 'path';
import authRoute from "./authRoute.js";
import Transdata from "../model/Transactions.js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
const router = express.Router();


router.get("/trans", authRoute, async (req, res) => {
    try {
        const Transactions = await Transdata.find();
        res.json( Transactions);
    } catch (err) {
        res.json({ "message": "error getting data" });
    }
})
router.get("/transactions", authRoute, async (req, res) => {
  try {
    const userId = req.user._id; 
    const userTransactions = await Transdata.find({
        $or: [{ sender: userId }, { receiver: userId }] // Find transactions where the sender or receiver ID matches the user's ID
    }).sort({ timestamp: -1 });
    res.json(userTransactions);
} catch (err) {
    console.error("Error fetching user transactions:", err.message);
    res.status(500).json({ error: "Error fetching user transactions" });
}
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Routes/Userimages/') // specify the directory where you want to store uploaded images
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });

const upload = multer({ storage: storage });

router.post("/user/upload", authRoute, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Profile Not Updated' });
      }
  
      // Save the image URL in the database
      const user_id = req.user._id;
      const imagePath = 'Routes/Userimages/' + req.file.filename;
      await Userdata.findByIdAndUpdate(user_id, { $set: { imagepath: imagePath } });
  
      res.json({ imageUrl: imagePath });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Error uploading image" });
    }
  });

cloudinary.config({
    cloud_name: 'dffrcy9y7',
    api_key: '733245193592217',
    api_secret: 'qL5clSKapy3dgThOSCy__Iy-JdY'
  });
  
//   router.post("/user/upload", authRoute, async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ message: 'Profile Not Updated' });
//       }
  
//       // Upload the image to Cloudinary
//       const result = await cloudinary.uploader.upload(req.file.path);
  
//       // Save the image URL in the database
//       const user_id = req.user._id;
//       const imageUrl = result.secure_url;
//       await Userdata.findByIdAndUpdate(user_id, { $set: { imagepath: imageUrl } });
  
//       res.json({ imageUrl });
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       res.status(500).json({ message: "Error uploading image" });
//     }
//   });
router.get("/users", authRoute, async (req, res) => {
    try {
        const user_id = req.user._id;
        // const users = await Userdata.find({ _id: { $ne: user_id } });
        const users = await Userdata.find({ _id: { $ne: user_id } })
                                    .select('_id name mobilenumber imagepath bankname');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error getting data" });
    }
});

router.get('/users/:userId', authRoute, async (req, res) => {
  try {
      const userId = req.params.userId;

      // Find user by userId
      const user = await Userdata.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Return selected user data
      const userData = {
          _id: user._id,
          name: user.name,
          mobilenumber: user.mobilenumber,
          imagepath: user.imagepath,
          bankname: user.bankname
      };

      res.json(userData);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error getting user data' });
  }
});
router.get("/trans/:transId", authRoute, async (req, res) => {
    const trans_id = req.params.transId;
    
    try {
        const Transaction = await Transdata.findById(trans_id);
        res.json(Transaction);
    } catch (err) {
        console.error("Error getting Transaction data:", err.message);
        res.json({ "message": "error getting data" });
    }
})


router.get("/user", authRoute, async (req, res) => {
    const user_id = req.user._id;
    console.log(user_id);
    try {
        const user = await Userdata.findById(user_id);
        res.json(user);
    } catch (err) {
        console.error("Error getting user data:", err.message);
        res.json({ "message": "error getting data" });
    }
})
const generateOTP = () => {
  // Define the length of the OTP
  const otpLength = 6;

  // Generate a random numeric string of specified length
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < otpLength; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      otp += digits[randomIndex];
  }

  return otp;
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahanthivikas965@gmail.com',
    pass: 'yohs ygkq adnf puak'
  }
});
router.get("/sendotp/:email", async (req, res) => {
  const { email } = req.params;

  try {
      // Check if the user exists with the provided email
      const user = await Userdata.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Generate a new OTP
      const otp = generateOTP();

      // Store the OTP in the database temporarily
      user.resetOTP = otp;
      await user.save();

      // Configure mail options
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Reset Password OTP',
          text: `OTP for Resetting Your Password:\n${otp}`
      };

      // Send the email with OTP
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error sending email:', error);
              return res.status(500).json({ message: "Failed to send OTP email" });
          } else {
              console.log('Email sent:', info.response);
              return res.json({ message: "OTP sent successfully" });
          }
      });

  } catch (err) {
      console.error("Error sending OTP:", err);
      return res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verifyotp", async (req, res) => {
  const { email, otp, password } = req.body;

  try {
      // Find the user with the provided email
      const user = await Userdata.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Check if the stored reset OTP matches the provided OTP
      if (user.resetOTP !== otp) {
          return res.status(400).json({ message: "Invalid OTP" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password with the hashed password
      user.password = hashedPassword;
      user.resetOTP = undefined; // Clear the resetOTP field
      await user.save();

      return res.json({ message: "OTP verified successfully and Password Updated Successfully" });

  } catch (err) {
      console.error("Error verifying OTP and updating password:", err);
      return res.status(500).json({ message: "Failed to verify OTP and update password" });
  }
});



router.get("/user/:id", authRoute, async (req, res) => {
  try {
    const id = req.params.id;
    
    // Fetch only specific fields from the user document
    const user = await Userdata.findById(id)
      .select('name mobilenumber bankname imagepath')
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



function generateTransactionId() {
    // Generate a timestamp
    const timestamp = Date.now().toString();

    // Generate a random string (you can adjust the length as needed)
    const randomString = Math.random().toString(36).substring(2, 15);

    // Concatenate timestamp and random string to create the transaction ID
    const transid = timestamp + randomString;
    
    return transid;
}



router.post("/user/sendmoney", authRoute, async (req, res) => {
    const { receiver = "", amount = "" } = req.body;
    const senderId = req.user._id;
    const transid = generateTransactionId();
    console.log("senderid",senderId);
    console.log("recieverid",receiver);
    try {
        // Find sender and receiver users based on their IDs
        const senderUser = await Userdata.findById(senderId);
        const receiverUser = await Userdata.findById(receiver);
        
        if (!senderUser || !receiverUser) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        // Convert amount to a number (assuming it's provided as a string)
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        if (senderUser.accountbalance < parsedAmount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        // Update sender's balance (decrement by the sent amount)
        senderUser.accountbalance -= parsedAmount;
        await senderUser.save();

        // Update receiver's balance (increment by the received amount)
        receiverUser.accountbalance += parsedAmount;
        await receiverUser.save();

        // Create a transaction record
        const transaction = await Transdata.create({
            sender: senderId,
            receiver,
            transid,
            amount: parsedAmount
        });

        return res.json({ message: "Money sent successfully", transaction });
    } catch (error) {
        console.log("Error sending money:", error.message);
        return res.status(500).json({ error: "Error sending money" });
    }
});


router.put("/user/updatebank",authRoute, async (req, res) => {
    try {
        const id = req.user._id;
        const { name="",email="", bankname= "", upipin = "",} = req.body;
        const user = await Userdata.findByIdAndUpdate(id, { $set: {name:name, email:email, bankname: bankname, upipin: upipin} }, { new: true });
        res.json(user);
        console.log('Bank Details updated succesfully');

    } catch (error) {
        console.log(error.message);
    }
})

// router.delete('/deleteUsersWithoutImagePath', async (req, res) => {
//     try {
//         // Find users where imagepath is not defined or null
//         const usersToDelete = await Userdata.find({ imagepath: { $exists: false } });

//         if (usersToDelete.length === 0) {
//             return res.status(404).json({ message: 'No users found without imagepath' });
//         }

//         // Delete users found without imagepath
//         await Userdata.deleteMany({ imagepath: { $exists: false } });

//         return res.status(200).json({
//             message: `Successfully deleted ${usersToDelete.length} user(s) without imagepath`,
//         });
//     } catch (error) {
//         console.error('Error deleting users without imagepath:', error);
//         return res.status(500).json({ message: 'Failed to delete users without imagepath' });
//     }
// });

// router.delete("/trans/clear", authRoute, async (req, res) => {
//   try {
      
//       await Transdata.deleteMany({});

//       res.json({ message: 'All transactions cleared successfully' });
//   } catch (error) {
//       console.error("Error clearing transactions:", error);
//       res.status(500).json({ error: "Error clearing transactions" });
//   }
// });


export default router;