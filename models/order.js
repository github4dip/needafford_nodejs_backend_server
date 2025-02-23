// order.js

import { addressSchema } from './address.js';
import { orderItemSchema } from './order_items.js';
import { orderItemAsPerAppSchema } from './order_items_as_per_app.js';
import mongoose from 'mongoose';


// Define the enumeration for product types
const StatusType = {
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    ARRIVEDATFINALDESTINATION:'arrived at final destination',
    DELIVERED:'delivered'
  };






const orderSchema = new mongoose.Schema({
    uniqueID: {
        type: String,
        // required: true
      },
    CustomerID: {
        type: String,
        // required: true
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
      ProductID: [{
        type: String,
        // required: true
      }],
      ProductName: [{
        type: String,
        // required: true
      }],
      SKU:[{
        /// for product variation 
        type:String,
        // required:true
      }],
      BillingAddress:{
        type:addressSchema
      },
      isBillingAddressSameAsShippingAddress:{
        type:Boolean,
        // required:true
      },
      ShippingAddress:{
        type:addressSchema,
        required:true
      },
      OrderedItems: {
        type: [orderItemSchema], // Change from single object to array of objects
        // required: true
    },
      Items: {
        type: [orderItemAsPerAppSchema], // Change from single object to array of objects
        // required: true
    },
      ShippingCost:{
        type:Number,
        required:true
      },
      TaxCost:{
        type:Number,
        required:true
      },
      TotalAmount:{
        type:Number,
        // required:true
      },
      Status:{
        type: String,
        enum: [StatusType.PROCESSING,StatusType.SHIPPED,StatusType.ARRIVEDATFINALDESTINATION,StatusType.DELIVERED],
        default:StatusType.PROCESSING
      },
      Phone: {
        type: String,
        // required : true,
        validate: {
            validator: function(v) {
              // Regular expression to check if the Phone Number is exactly 10 digits long
              return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid Phone number. It must be exactly 10 digits long.`
          }
    },
    OrderDate:{
      type:Date
    },
    DeliveryDate:{
      type:Date
    },
    PaymentID:{
        type:String,
        // required:true
    },
    PaymentMethod:{
        type:String,
        // required:true
    },
    PaymentSuccessfull:{
        type:Boolean,
        // required:true
    }
}, { timestamps: true })
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

export const Order = mongoose.model('Order', orderSchema);

export {orderSchema};
