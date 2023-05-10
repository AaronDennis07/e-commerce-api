const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        requried: [true, 'name must be provided'],
        maxlength: [100, 'Name cannot exceed 100 characters']

    },
    price: {
        type: Number,
        required: [true, 'Price must be provided'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'description must be provided'],
        maxlength: [1000, 'description cannot exceed 1000 characters']
    },
    image: {
        type: String,
        default: '/uploads/example.png'
    },
    category: {
        type: String,
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
        type: String,
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: '{VALUE} is not supported'
        }
    },
    colors: {
        type: [String],
        required: true,
        default: ['#222']
    },
    featured: {
        type: Boolean,
        default: false
    },
    freeShipping: {
        type: Boolean,
        default: false
    },
    averageRating: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },

},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
})

productSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
});


module.exports = mongoose.model('Product', productSchema)