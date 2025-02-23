import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({

    ProductID: {
        type: String,
        required: true
      },
      ProductName: {
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
      Price:{
        type:Number,
        required:true
      },
      OldPrice:{
        type:Number,
        required:true
      },
      Images: [
        {
            type: String,
            
        }
      ],
      Rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      Quantity:{
        type:Number,
        required:true,
        min: 1
      },
      TotalPrice:{
        type:Number,
        required:true
      },
      SKU:{
        /// for product variation 
        type:String,
        required:true
      },
      SelectedVariation:{
        type:Map,
        of:String
      }


},{timestamps:true})

cartSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

cartSchema.set('toJSON', {
    virtuals: true,
});

// Create the model based on the schema
export const Cart = mongoose.model('Cart', cartSchema);
export {cartSchema};
