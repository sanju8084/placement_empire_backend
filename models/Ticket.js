// models/Ticket.js
const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  category: String,
});

module.exports = mongoose.model("Ticket", TicketSchema);
