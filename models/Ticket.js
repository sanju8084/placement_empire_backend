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
    default: "Not Done",
  },
  screenshot: String,
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);
