// orderRoutes.js

import express from 'express';
import { Order } from '../models/order.js';

const router = express.Router();

// Create a new order
router.post('/add', async (req, res) => {
    const { id,userId,adhaarNumber, totalAmount, orderDate,shippingAddress, billingAddress,paymentMethod,billingAddressSameAsShipping,deliveryDate,items, shippingCost,taxCost } = req.body;
    try {
        // Validate date formats
        if (!orderDate || isNaN(new Date(orderDate).getTime())) {
            return res.status(400).json({ error: true, msg: 'Invalid order date format' });
        }
        

         // Convert the string to a Date object
         const orderDateFormatted = new Date(orderDate);
         const deliveryDateFormatted = new Date(deliveryDate);

         console.log(req.body);
        const newOrder = await Order.create({
            uniqueID:id,
            CustomerID:userId,
            CustomerAadhaar:adhaarNumber,
            BillingAddress:billingAddress,
            isBillingAddressSameAsShippingAddress:billingAddressSameAsShipping,
            ShippingAddress:shippingAddress,
            Items:items,
            ShippingCost:shippingCost,
            TaxCost:taxCost,
            TotalAmount:totalAmount,
            // Status:status,
            OrderDate:orderDateFormatted,
            // DeliveryDate:deliveryDateFormatted,
            PaymentMethod:paymentMethod

        });
        console.log(newOrder);
        // Log the created order
        // // console.log("New Order Created:", newOrder);
        if (!newOrder) {
            return res.status(400).json({ error: true, msg: 'The new order is failed hereeeeee!' });
        }
        res.status(200).json({
            newOrder: newOrder
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update an existing order
router.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const order = await Order.findByIdAndUpdate(id, updates, { new: true });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get an order by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
