// ProductVariation.js
import mongoose from 'mongoose';

const ProductVariationSchema = new mongoose.Schema({
  SKU: {
    type: String,
  },
  Image: {
    type: String,
  },
  Descripation: {
    type: String,
  },
  Price: {
    type: Number,
  },
  SalePrice: {
    type: Number,
  },
  Stock: {
    type: Number,
  },
  AttributeValues:{
    type:Map,
    of:String
  }
},{timestamps:true})

ProductVariationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ProductVariationSchema.set('toJSON', {
    virtuals: true,
});

export const ProductVariation = mongoose.model('ProductVariation', ProductVariationSchema);

export {ProductVariationSchema};
