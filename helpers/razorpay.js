const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});


const createOrder = async (amount, currency = 'INR', receipt, payment_capture = 1) => {
    const options = {
        amount: amount * 100, // amount in paise
        currency: currency,
        receipt: receipt,
        payment_capture: payment_capture
    };

    try {
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw new Error(`Error creating Razorpay order: ${error.message}`);
    }
};

module.exports = {
    createOrder
}