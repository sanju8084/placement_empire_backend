const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  category: String,
  ticketNo: String, // Add this field
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);
