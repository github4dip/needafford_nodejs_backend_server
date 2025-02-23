import { Review } from '../models/review.js';

import express from 'express';

const router = express.Router();




router.post('/add', async (req, res) => {
    const { ProductID,ProductName,CustomerFirstName,CustomerLastName,CustomerID, CustomerAadhaar,CustomerReview,CustomerRating,
        isVerifiedPurchase} = req.body;

    try {
        
        if (!ProductID || !ProductName || !CustomerFirstName || !CustomerLastName || !CustomerID || !CustomerAadhaar || !CustomerReview || !CustomerRating) {
            return res.status(400).json({ error: 'Fields must be provided' });
          }
        

        const result = await Review.create({

            ProductID,
            ProductName,
            CustomerFirstName,
            CustomerLastName,
            CustomerID,
            CustomerAadhaar,
            CustomerReview,
            CustomerRating,
            isVerifiedPurchase

        });

        
        if (!result) {
            return res.status(400).send('The review is not created!');
        }


        res.status(200).json({
            userReview: result
        });

    } 
    // catch (error) {
    //     console.log(error);
    //     res.status(500).json({ error: true, msg: "something went wrong" });
    // }
    catch (err) {
        // Handle validation errors and other errors
        console.error(err);
        if (err.name === 'ValidationError') {
            // If it's a validation error, respond with a detailed error message
            const errors = Object.values(err.errors).map(e => e.message);
            res.status(400).json({ success: false, errors });
          }
        
          // For other errors
          else{return res.status(500).json({ success: false, message: 'Oh ho ! something went wrong on our side , please try again later , if issue persist contact support team' });}
        }
});







router.get('/:productid', async (req, res) => {
    try {
        const reviewsForProduct = await Review.find({ProductID:req.params.productid});
        if (!reviewsForProduct) {
            return res.status(500).json({ message: 'The user with the given Adhaar was not found.' });
        } else {
            return res.status(200).send(reviewsForProduct);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred.' });
    }
});




































export default router;