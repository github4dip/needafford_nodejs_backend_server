import { User } from '../models/user.js';
// import { ImageUpload } from '../models/imageUpload.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import multer from 'multer';
// import fs from 'fs';
// import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// cloudinary.config({
//     cloud_name: process.env.cloudinary_Config_Cloud_Name,
//     api_key: process.env.cloudinary_Config_api_key,
//     api_secret: process.env.cloudinary_Config_api_secret,
//     secure: true
// });

// let imagesArr = [];

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads");
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}_${file.originalname}`);
//     },
// });

// const upload = multer({ storage });

// router.post('/upload', upload.array("images"), async (req, res) => {
//     imagesArr = [];

//     try {
//         for (let i = 0; i < req?.files?.length; i++) {
//             const options = {
//                 use_filename: true,
//                 unique_filename: false,
//                 overwrite: false,
//             };

//             const result = await cloudinary.uploader.upload(req.files[i].path, options);
//             imagesArr.push(result.secure_url);
//             fs.unlinkSync(`uploads/${req.files[i].filename}`);
//         }

//         let imagesUploaded = new ImageUpload({
//             images: imagesArr,
//         });

//         imagesUploaded = await imagesUploaded.save();
//         return res.status(200).json(imagesArr);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: true, msg: "something went wrong" });
//     }
// });

router.post('/signup', async (req, res) => {
    const { AdhaarNumber,PAN,FirstName,LastName, Phone, Email,ProfilePicture, Password,DOB,Gender,AdhaarAddress,Address, isAdmin } = req.body;

    try {
        const existingUser = await User.findOne({ Email: Email });
        const existingUserByPhone = await User.findOne({ Phone: Phone });
        const existingUserByAdhaarNumber = await User.findOne({ AdhaarNumber: AdhaarNumber });
        // const existingUserByPAN = await User.findOne({ PAN:PAN });

        if (existingUser && existingUserByPhone && existingUserByAdhaarNumber) {
            return res.status(400).json({ error: true, msg: "user already exists!" });
        }
        if (existingUser) {
            return res.status(400).json({ error: true, msg: "User with this email already exists!" });
        }

        if (existingUserByPhone) {
            return res.status(400).json({ error: true, msg: "User with this phone number already exists!" });
        }
        if (existingUserByAdhaarNumber) {
            return res.status(400).json({ error: true, msg: "User with this Adhaar number already exists!" });
        }
        if (PAN!=null && PAN!="") {
            const existingUserByPAN = await User.findOne({ PAN:PAN });
            if (existingUserByPAN) {
                return res.status(400).json({ error: true, msg: "User with this PAN number already exists!" });
            }
            
        }

        const hashPassword = await bcrypt.hash(Password, 10);

        const result = await User.create({
            AdhaarNumber,
            FirstName,
            LastName,
            Email,
            Phone,
            Password: hashPassword,
            DOB,
            Gender,
            ProfilePicture,
            AdhaarAddress,
            Address:[AdhaarAddress],
            isAdmin
        });

        const token = jwt.sign({ Email: result.Email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).json({
            user: result,
            token
        });

    } 
    // catch (error) {
    //     console.log(error);
    //     res.status(500).json({ error: true, msg: "something went wrong" });
    // }
    catch (err) {
        // Handle validation errors and other errors
        console.error(err);
        //
        // Handle duplicate key errors specifically
        if (err.code === 11000) {
            const duplicateFields = Object.keys(err.keyPattern); // Extract the duplicate field names
            let errorMsg = "Duplicate key error:";

            if (duplicateFields.includes('Email')) {
                errorMsg += " User with this email already exists!";
            }

            if (duplicateFields.includes('Phone')) {
                errorMsg += " User with this phone number already exists!";
            }
            if (duplicateFields.includes('AdhaarNumber')) {
                errorMsg += " User with this Adhaar number already exists!";
            }
            if (duplicateFields.includes('PAN')) {
                errorMsg += " User with this PAN number already existssssssssssss!";
            }

            return res.status(400).json({ error: true, msg: errorMsg });
        } 
        
        // Handle validation errors
       
        if (err.name === 'ValidationError') {
          // If it's a validation error, respond with a detailed error message
          const errors = Object.values(err.errors).map(e => e.message);
          res.status(400).json({ success: false, errors });
        }else {
          // For other errors
          res.status(500).json({ success: false, message: 'Oh ho ! something went wrong on our side , please try again later , if issue persist contact support team' });
        }}
});

router.post('/signin', async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const existingUser = await User.findOne({ Email: Email });
        if (!existingUser) {
            return res.status(404).json({ error: true, msg: "User not found!" });
        }

        const matchPassword = await bcrypt.compare(Password, existingUser.Password);

        if (!matchPassword) {
            return res.status(400).json({ error: true, msg: "Invalid credentials" });
        }

        const token = jwt.sign({ email: existingUser.Email, id: existingUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        return res.status(200).json({
            user: existingUser,
            token,
            msg: "User Authenticated"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "something went wrong" });
    }
});

router.put('/changePassword/:id', async (req, res) => {
    const { name, phone, email, password, newPass, images } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ error: true, msg: "User not found!" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(404).json({ error: true, msg: "Current password wrong" });
        } else {
            let newPassword = newPass ? await bcrypt.hash(newPass, 10) : existingUser.password;

            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    name,
                    phone,
                    email,
                    password: newPassword,
                    images,
                },
                { new: true }
            );

            if (!user) {
                return res.status(400).json({ error: true, msg: 'The user cannot be updated!' });
            }

            return res.send(user);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "something went wrong" });
    }
});

// router.get('/', async (req, res) => {
//     try {
//         const userList = await User.find();
//         if (!userList) {
//             return res.status(500).json({ success: false });
//         }
//         res.send(userList);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false });
//     }
// });

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(500).json({ message: 'The user with the given ID was not found.' });
        } else {
            return res.status(200).send(user);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred.' });
    }
});
router.get('/adhaar/:adhaar', async (req, res) => {
    try {
        const user = await User.findOne({AdhaarNumber:req.params.adhaar});
        if (!user) {
            return res.status(500).json({ message: 'The user with the given Adhaar was not found.' });
        } else {
            return res.status(200).send(user);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            return res.status(200).json({ success: true, message: 'The user is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: "User not found!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        if (!userCount) {
            return res.status(500).json({ success: false });
        }
        res.send({ userCount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
});

router.post('/authWithGoogle', async (req, res) => {
    const { name, phone, email, password, images, isAdmin } = req.body;

    try {
        let existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            existingUser = await User.create({
                name,
                phone,
                email,
                password,
                images,
                isAdmin
            });

            const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

            return res.status(200).json({
                user: existingUser,
                token,
                msg: "User Login Successfully!"
            });
        } else {
            const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

            return res.status(200).json({
                user: existingUser,
                token,
                msg: "User Login Successfully!"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "something went wrong" });
    }
});

router.put('/:id', async (req, res) => {
    const { name, phone, email, images } = req.body;

    try {
        const userExist = await User.findById(req.params.id);

        let newPassword = req.body.password ? await bcrypt.hash(req.body.password, 10) : userExist.password;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                phone,
                email,
                password: newPassword,
                images: imagesArr,
            },
            { new: true }
        );

        if (!user) {
            return res.status(400).send('The user cannot be updated!');
        }

        return res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred.');
    }
});



router.patch('/updatePAN/:adhaar',async(req,res)=>{
    const { PAN } = req.body;

    try {
        if (PAN && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(PAN)) {
            return res.status(400).json({ message: 'PAN is not a valid 10 character uppercase alphanumeric string' });
          }
        const userExist = await User.findOne({AdhaarNumber: req.params.adhaar});

       if(!userExist){
        return res.status(400).send('The user doesn\'t existed!');
       }

        const user = await User.findOneAndUpdate(
            {AdhaarNumber: req.params.adhaar},
            {
                PAN
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(400).send('The user cannot be updateddddddd!');
        }

        return res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred.');
    }

});























// router.delete('/deleteImage', async (req, res) => {
//     const imgUrl = req.query.img;

//     try {
//         const urlArr = imgUrl.split('/');
//         const image = urlArr[urlArr.length - 1];
//         const imageName = image.split('.')[0];

//         const response = await cloudinary.uploader.destroy(imageName);

//         if (response) {
//             return res.status(200).send(response);
//         } else {
//             return res.status(500).send('Failed to delete image.');
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('An error occurred while deleting the image.');
//     }
// });

export default router;

