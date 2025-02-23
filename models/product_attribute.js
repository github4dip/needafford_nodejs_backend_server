// ProductAttribute.js
import mongoose from 'mongoose';

const ProductAttributeSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
  Values: [{
    type: String,
  }]
});

export const ProductAttribute = mongoose.model('ProductAttribute', ProductAttributeSchema);

export {ProductAttributeSchema};
