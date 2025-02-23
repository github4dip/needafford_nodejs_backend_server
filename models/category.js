// category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true,
    },
    Slug: {
        type: String,
        required: true,
        unique: true,
    },
    Image: {
        type: String,
        required: true,
    },
    Color: {
        type: String,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
})
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});

export const Category = mongoose.model('Category', categorySchema);

export {categorySchema};
