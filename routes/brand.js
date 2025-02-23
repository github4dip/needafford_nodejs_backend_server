// routes/brand.js

import { Brand } from '../models/brand.js'; // Import the brand model
import express from 'express';
const router = express.Router();

// POST: Add a new brand
router.post('/add', async (req, res) => {
  try {
    const { Name,Image, isFeatured, ProductsCount } = req.body;

    // Create a new brand instance
    const brand = new Brand({  Name,Image, isFeatured, ProductsCount });

    // Save the brand to the database
    await brand.save();

    // Respond with the created brand
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Error creating brand', error });
  }
});

// PATCH: Update an existing brand
router.patch('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Name,Image, isFeatured, ProductsCount } = req.body;

    // Find the brand by ID and update it
    const brand = await Brand.findByIdAndUpdate(id, { Name,Image, isFeatured, ProductsCount }, { new: true ,runValidators: true});

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Respond with the updated brand
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Error updating brand', error });
  }
});

// GET: Read active brands
router.get('/featured', async (req, res) => {
  try {
    // Find all active brands
    const brand = await Brand.find({ isFeatured: true });

    // Respond with the active brands
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands', error });
  }
});

export default router;
