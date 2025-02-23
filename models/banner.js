// banner.js
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  Image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default:false
  },
  TargetScreen: {
    type: String,
    required: true
  }
}, { timestamps: true })
bannerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

bannerSchema.set('toJSON', {
    virtuals: true,
});

export const Banner = mongoose.model('Banner', bannerSchema);

export {bannerSchema};
