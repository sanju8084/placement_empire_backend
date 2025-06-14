const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const { name, mobile, email, category } = req.body;

    // Save to MongoDB
    const ticket = new Ticket({ name, mobile, email, category });
    await ticket.save();
 res.send("Saved")
    // Render EJS template
    const templatePath = path.join(__dirname, "../templates/ticket.ejs");

    ejs.renderFile(templatePath, { name, mobile, email, category }, (err, html) => {
      if (err) {
        console.error("EJS render error:", err);
        return res.status(500).send("Template error");
      }

      // Convert to PDF
      pdf.create(html).toBuffer((err, buffer) => {
        if (err) {
          console.error("PDF error:", err);
          return res.status(500).send("PDF error");
        }
  console.log("PDF generated"); 

        // Send email
        const transporter = nodemailer.createTransport({
service: "gmail",
  
            auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

        });

        const mailOptions = {
  from: "sanjanakiei20@gmail.com",
  to: email,
  subject: "Your Event Ticket",
  text: "Please find your ticket attached.",
  attachments: [{ filename: "ticket.pdf", content: buffer }],
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error("Email error:", err);
    return res.status(500).send("Email send error");
  }

  console.log("Email sent: ", info.response);
  res.status(200).send("Ticket submitted and emailed.");
});

      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
