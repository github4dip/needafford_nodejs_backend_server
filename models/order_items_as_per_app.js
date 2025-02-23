import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderItemAsPerAppSchema = new Schema({

    productId:{
      type:String
    },
    title:{
      type:String
    },
    price:{
      type:Number
    },
    image:{
      type:String
    },
    quantity:{
      type:Number
    },
    variationId:{
      type:String
    },
    brandName:{
      type:String
    },
    selectedVariation:{
      type:Map,
      of:String
    }



},{timestamps:true})

orderItemAsPerAppSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderItemAsPerAppSchema.set('toJSON', {
    virtuals: true,
});

// Create the model based on the schema
export const OrderItemAsPerApp = mongoose.model('OrderItemAsPerApp', orderItemAsPerAppSchema);
export {orderItemAsPerAppSchema};