import { Cart } from '../models/cart.js';
import mongoose from 'mongoose';

import express from 'express';

const router = express.Router();





router.post('/add', async (req, res) => {
    const { ProductID,ProductName,CustomerID, CustomerAadhaar,Price,OldPrice,Images,Rating,Quantity,TotalPrice,SKU,
        SelectedVariation} = req.body;

    try {
        
        if (!ProductID||!ProductName||!CustomerID||! CustomerAadhaar||!Price||!OldPrice||!Images||!Rating||!Quantity||!TotalPrice||!SKU) {
            return res.status(400).json({ error: 'Fields must be provided' });
          }
        

        const result = await Cart.create({

            ProductID,
            ProductName,
            CustomerID,
            CustomerAadhaar,
            Price,
            OldPrice,
            Images,
            Rating,
            Quantity,
            TotalPrice,
            SKU,
            SelectedVariation

        });

        
        if (!result) {
            return res.status(400).send('The Cart Item is not created!');
        }


        res.status(200).json({
            userCart: result
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










// GET route to fetch cart items based on Aadhaar number
router.get('/items/:aadhaar', async (req, res) => {
    const { aadhaar } = req.params;
  
    // Validate Aadhaar number
    if (!/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ error: 'Invalid Aadhaar number. It must be exactly 12 digits long.' });
    }
  
    try {
      // Query the Cart collection by CustomerAadhaar
      const cartItems = await Cart.find({ CustomerAadhaar: Number(aadhaar) });
  
      if (!cartItems.length) {
        return res.status(404).json({ message: 'No cart items found for this Aadhaar number.' });
      }
  
      // Respond with the cart items
      res.status(200).json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: 'An error occurred while fetching cart items.' });
    }
});






// DELETE route to remove a cart item by ID
router.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
  
    // Validate the ID format (could use a more sophisticated validation depending on your needs)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid cart ID format.' });
    }
  
    try {
      // Attempt to delete the cart item by ID
      const result = await Cart.findByIdAndDelete(id);
  
      // Check if an item was deleted
      if (!result) {
        return res.status(404).json({ message: 'Cart item not found.' });
      }
  
      // Respond with a success message
      res.status(200).json({ message: 'Cart item deleted successfully.' });
    } catch (error) {
      console.error('Error deleting cart item:', error);
      res.status(500).json({ error: 'An error occurred while deleting the cart item.' });
    }
});


// PATCH route to update the quantity of a cart item by ID
router.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { Quantity } = req.body;
  
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid cart ID format.' });
    }
  
    // Validate the quantity
    if (typeof Quantity !== 'number' || Quantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity. It must be a non-negative number.' });
    }
  
    try {
      // Find the cart item by ID and update the quantity
      const result = await Cart.findByIdAndUpdate(
        id,
        { $set: { Quantity: Quantity } },
        { new: true, runValidators: true }
      );
  
      // Check if the item was found and updated
      if (!result) {
        return res.status(404).json({ message: 'Cart item not found.' });
      }
  
      // Respond with the updated cart item
      res.status(200).json(result);
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      res.status(500).json({ error: 'An error occurred while updating the cart item quantity.' });
    }
});

// PATCH route to increment the quantity of a cart item by 1
router.patch('/update/items/increment-quantity/:id', async (req, res) => {
    const { id } = req.params;
  
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid cart ID format.' });
    }
  
    try {
      // Find the cart item by ID
      const cartItem = await Cart.findById(id);
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found.' });
      }
  
      // Increment the quantity by 1
      cartItem.Quantity += 1;
  
      // Save the updated cart item
      const updatedCartItem = await cartItem.save();
  
      // Respond with the updated cart item
      res.status(200).json(updatedCartItem);
    } catch (error) {
      console.error('Error incrementing cart item quantity:', error);
      res.status(500).json({ error: 'An error occurred while incrementing the cart item quantity.' });
    }
});




// PATCH route to decrement the quantity of a cart item by 1
router.patch('/update/items/decrement-quantity/:id', async (req, res) => {
    const { id } = req.params;
  
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid cart ID format.' });
    }
  
    try {
      // Find the cart item by ID
      const cartItem = await Cart.findById(id);
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found.' });
      }
  
      // Decrement the quantity by 1
      if (cartItem.Quantity > 0) {
        cartItem.Quantity -= 1;
  
        if (cartItem.Quantity === 0) {
          // If quantity is 0, delete the cart item
          await Cart.findByIdAndDelete(id);
          return res.status(200).json({ message: 'Cart item deleted as quantity reached 0.' });
        }
  
        // Save the updated cart item
        const updatedCartItem = await cartItem.save();
        return res.status(200).json(updatedCartItem);
      } else {
        return res.status(400).json({ message: 'Quantity is already 0 or less.' });
      }
    } catch (error) {
      console.error('Error decrementing cart item quantity:', error);
      return res.status(500).json({ error: 'An error occurred while decrementing the cart item quantity.' });
    }
  });







export default router;