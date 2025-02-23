import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderItemSchema = new Schema({

    ProductID: {
        type: String,
        // required: true
      },
      ProductName: {
        type: String,
        // required: true
      },
      Price:{
        type:Number,
        // required:true
      },
      OldPrice:{
        type:Number,
        // required:true
      },
      Images: [
        {
            type: String,
            
        }
      ],
      Quantity:{
        type:Number,
        // required:true,
        min: 1
      },
      TotalPrice:{
        type:Number,
        // required:true
      },
      SKU:{
        /// for product variation 
        type:String,
        // required:true
      },
      isVariableProduct:{
        type:Boolean
      },
      SelectedVariation:{
        type:Map,
        of:String
      },
      VariationID:{
        type:String
      }



},{timestamps:true})

orderItemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderItemSchema.set('toJSON', {
    virtuals: true,
});

// Create the model based on the schema
export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export {orderItemSchema};