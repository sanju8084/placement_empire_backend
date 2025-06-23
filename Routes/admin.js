const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

router.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.delete("/tickets/:id", async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.send("Ticket deleted");
  } catch (err) {
    res.status(500).send("Delete failed");
  }
});

module.exports = router;
