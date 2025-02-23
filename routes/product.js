// productRoutes.js

import { Product } from '../models/product.js';
import express from 'express';

const router = express.Router();

// Create a new product (POST)
router.post('/add', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product by ID (PATCH)
router.patch('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a product by ID (GET)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




// // PATCH endpoint to update product
// router.patch('/update/:productId', async (req, res) => {
//     const { productId } = req.params;
//     const updates = req.body;

//     try {
//         // Find the product by ID
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         // Update the product fields
//         Object.keys(updates).forEach(key => {
//             if (key === 'ProductVariations') {
//                 // Handling updates to ProductVariations
//                 updates.ProductVariations.forEach(update => {
//                     const variationIndex = product.ProductVariations.findIndex(v => v._id.toString() === update._id);
//                     if (variationIndex !== -1) {
//                         product.ProductVariations[variationIndex] = {
//                             ...product.ProductVariations[variationIndex].toObject(),
//                             ...update
//                         };
//                     }
//                 });
//             } else {
//                 // Update other fields directly
//                 product[key] = updates[key];
//             }
//         });

//         // Save the updated product
//         await product.save();

//         res.status(200).json(product);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

export default router;
