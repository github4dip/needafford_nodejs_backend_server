// routes/banner.js

import { Banner } from '../models/banner.js'; // Import the Banner model
import express from 'express';
const router = express.Router();

// POST: Add a new banner
router.post('/add', async (req, res) => {
  try {
    const { Image, isActive, TargetScreen } = req.body;

    // Create a new banner instance
    const banner = new Banner({ Image, isActive, TargetScreen });

    // Save the banner to the database
    await banner.save();

    // Respond with the created banner
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error creating banner', error });
  }
});

// PATCH: Update an existing banner
router.patch('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Image, isActive, TargetScreen } = req.body;

    // Find the banner by ID and update it
    const banner = await Banner.findByIdAndUpdate(id, { Image, isActive, TargetScreen }, { new: true });

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Respond with the updated banner
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner', error });
  }
});

// GET: Read active banners
router.get('/active', async (req, res) => {
  try {
    // Find all active banners
    const banners = await Banner.find({ isActive: true });

    // Respond with the active banners
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error });
  }
});

export default router;
