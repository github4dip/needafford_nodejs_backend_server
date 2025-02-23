// reviewModel.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the review schema
const reviewSchema = new Schema({
  ProductID: {
    type: String,
    required: true
  },
  ProductName: {
    type: String,
    required: true
  },
  CustomerFirstName: {
    type: String,
    required: true
  },
  CustomerLastName: {
    type: String,
    required: true
  },
  CustomerID: {
    type: String,
    required: true
  },
  CustomerAadhaar: {
    type: Number,
    required: true,
    validate: {
        validator: function(v) {
          // Regular expression to check if the Adhaar Number is exactly 12 digits long
          return /^\d{12}$/.test(v);
        },
        message: props => `${props.value} is not a valid Adhaar number. It must be exactly 12 digits long.`
      }
  },
  CustomerReview: {
    type: String,
    required: true
  },
  CustomerRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  isVerifiedPurchase:{
    type:Boolean,
    default: true
},
},{timestamps:true})

reviewSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

reviewSchema.set('toJSON', {
    virtuals: true,
});

// Create the model based on the schema
export const Review = mongoose.model('Review', reviewSchema);
export {reviewSchema};
