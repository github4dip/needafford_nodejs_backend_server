import mongoose from 'mongoose';
import { addressSchema } from './address.js';

const userSchema = new mongoose.Schema({
    AdhaarNumber: {
        type: Number,
        required: true,
        unique:true,
        validate: {
            validator: function(v) {
              // Regular expression to check if the Adhaar Number is exactly 12 digits long
              return /^\d{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid Adhaar number. It must be exactly 12 digits long.`
          }
    },
    PAN: {
        type: String,
        unique:true,
        sparse: true,
        validate: {
            validator: function(v) {
              // Regular expression to check if the string is exactly 10 alphanumeric characters
              return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10 character uppercase alphanumeric string!`
          }
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Phone: {
        type: String,
        required : true,
        unique: true,
        validate: {
            validator: function(v) {
              // Regular expression to check if the Phone Number is exactly 10 digits long
              return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid Phone number. It must be exactly 10 digits long.`
          }
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    DOB: {
        type: String,
    },
    Gender: {
        type: String,
        enum: ['F', 'M', 'O']
    },
    AdhaarAddress: {
        type: String,
        required: true
        
    },
    Address: [{
        type: [mongoose.Schema.Types.Mixed], // each element can be a string or an object
        default: []
      }],
    ProfilePicture:{
        type: String
    },
    images: [
        {
            type: String,
            
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true // This will add createdAt and updatedAt fields
  });

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

export const User = mongoose.model('User', userSchema);
export { userSchema };
