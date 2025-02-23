// categoryRoutes.js
import { Category } from '../models/category.js';
import express from 'express';

const router = express.Router();

// Get all categories where isFeatured is true
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isFeatured: true });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve categories', error });
    }
});

// Add a new category
router.post('/add', async (req, res) => {
    const { Name, Slug, Image, Color, isFeatured } = req.body;
    
    if (!Name || !Slug || !Image || !Color) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        const result = await Category.create({

            Name,
            Slug,
            Image,
            Color,
            isFeatured

        });

        
        if (!result) {
            return res.status(400).send('The Cart Item is not created!');
        }


        res.status(200).json({
            category: result
        });
    } catch (err) {
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

// Update a category by ID
router.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update category', error });
    }
});

export default router;
