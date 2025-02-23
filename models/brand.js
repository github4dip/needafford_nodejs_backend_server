// brand.js
import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Image: {
    type: String,
    required: true
  },
  isFeatured: {
    type: Boolean,
    default:false
  },
  ProductsCount: {
    type: Number,
    required: true
  }
}, { timestamps: true })
brandSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

brandSchema.set('toJSON', {
    virtuals: true,
});

export const Brand = mongoose.model('Brand', brandSchema);

export {brandSchema};
