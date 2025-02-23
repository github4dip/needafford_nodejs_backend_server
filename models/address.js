import mongoose from 'mongoose';



const addressSchema = new mongoose.Schema({
    UniqueID:{
        type:String,
        // required:true
    },
    FirstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    CustomerID:{
        type:String,
        required:true
    },
    AdhaarNumber: {
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
    Phone: {
        type: String,
        required : true,
        validate: {
            validator: function(v) {
              // Regular expression to check if the Phone Number is exactly 10 digits long
              return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid Phone number. It must be exactly 10 digits long.`
          }
    },
    Address:{
        type:String,
        required:true
    },
    Street:{
        type:String,
    },
    NearestLandmark:{
        type:String,
    },
    City:{
        type:String,
    },
    State:{
        type:String,
    },
    Country:{
        type:String,
    },
    Pincode:{
        type:String,
        required : true
    },
    isSelectedAddress:{
        type:Boolean,
        default: false
    },
},{timestamps:true})

addressSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

addressSchema.set('toJSON', {
    virtuals: true,
});

export const UserAddress = mongoose.model('UserAddress', addressSchema);
export { addressSchema };