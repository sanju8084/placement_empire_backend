const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount*100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({ id: order.id, amount: order.amount }); // Return id and amount
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).send("Payment initialization failed");
  }
});

module.exports = router;
