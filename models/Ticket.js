// const mongoose = require("mongoose");

// const TicketSchema = new mongoose.Schema({
//   name: String,
//   mobile: String,
//   email: String,
//   category: String,
//   price: Number,
//   ticketNo: String,
//   razorpay_payment_id: String,

// }, { timestamps: true });

// module.exports = mongoose.model("Ticket", TicketSchema);

const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  category: String,
  price: Number,
  ticketNo: String,
  paymentStatus: {
    type: String,
    enum: ["Done", "Not Done"],
    default: "Not Done"
  },
  paymentScreenshot: String,
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);
