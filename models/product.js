// product.js
import mongoose from 'mongoose';

import { ProductAttributeSchema } from './product_attribute.js';
import { ProductVariationSchema } from './product_variation.js';
import { brandSchema } from './brand.js';




// Define the enumeration for product types
const ProductType = {
    SINGLE: 'single',
    VARIABLE: 'variable'
  };

// Define the schema  
const productSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  Description:{
    type:String,
    required:true
  },
  Price:{
    type:Number,
    required:true
  },
  OldPrice:{
    type:Number,
    required:true
  },
  Discount:{
    type:Number,
    min:0,
    max:100
  },
  CategoryName: {
    type: String,
    required: true
  },
  CategoryID: {
    type: Number,
    required: true
  },
  SKU: {
    type: String,
    required: true
  },
  ProductID: {
    type: String,
    required: true
  },
  CountInStock: {
    type: Number,
  },
  Rating:{
    type:Number,
    min:1,
    max:5
  },
  isFeatured: {
    type: Boolean,
    default:false
  },
  Brand:{
    type:brandSchema,
    required:true
  },
  Images: [
    {
        type: String,
        
    }
  ],
  ProductType: {
    type: String,
    enum: [ProductType.SINGLE, ProductType.VARIABLE],
    required: true
  },
  ProductAttributes: {
    type: [ProductAttributeSchema],
    validate: {
      validator: function(v) {
        // Validate that ProductAttributes is required when productType is VARIABLE
        return this.ProductType === ProductType.SINGLE || (this.ProductType === ProductType.VARIABLE && v.length > 0);
      },
      message: 'ProductAttributes is required when productType is variable.'
    }
  },
  ProductVariations: {
    type: [ProductVariationSchema],
    validate: {
      validator: function(v) {
        // Validate that ProductVariations is required when productType is VARIABLE
        return this.ProductType === ProductType.SINGLE || (this.ProductType === ProductType.VARIABLE && v.length > 0);
      },
      message: 'ProductVariations is required when productType is variable.'
    }
  }

}, { timestamps: true })
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

export const Product = mongoose.model('Product', productSchema);

export {productSchema};
