const mongoose = require('mongoose');

const categoryOfferSchema = new mongoose.Schema({
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    offerName: {
        type: String,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    endDate: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

categoryOfferSchema.index({ endDate: 1 }, { expireAfterSeconds: 1 });
module.exports = mongoose.model('CategoryOffer', categoryOfferSchema);
