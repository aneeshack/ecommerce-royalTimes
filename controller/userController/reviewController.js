const reviewModel = require('../../models/review');

const reviewProduct = async (req, res) => {
    try {
        console.log('in the reviewing product')
        const { rating, review, productId, userId } = req.body;
        console.log('all the details are:', rating, review, productId, userId);
        const existingReview = await reviewModel.findOne({ userId, productId });

        if (existingReview) {
            existingReview.rating = rating;
            existingReview.review = review;

            await existingReview.save();
            console.log('existingReview items are:', existingReview);
            res.status(200).json({ success: 'review updated' })

        } else {
            const newReview = new reviewModel({
                productId,
                userId,
                rating,
                review
            })
            await newReview.save();
            console.log('new review items are:', newReview);
            res.status(200).json({ success: 'review updated' })
        }

    } catch (error) {
        console.log('error in review a product:', error.message);
        res.status(500).json({ error: 'Failed to review product' });
    }
}

module.exports = {
    reviewProduct
}