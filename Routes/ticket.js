const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const fs = require("fs");
const imagePath = path.join(__dirname, "../public/logo.png"); // Make sure it's .jpg or .png
const base64Image = fs.readFileSync(imagePath).toString("base64");

router.post("/", async (req, res) => {
  try {
    const { name, mobile, email, category } = req.body;

    // Get the latest ticket to determine the next number
    const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });

    let ticketNumber = 1;
    if (lastTicket && lastTicket.ticketNo) {
      const lastNo = parseInt(lastTicket.ticketNo.match(/\d+/)[0]); // Extract 01 from PEM01/...
      ticketNumber = lastNo + 1;
    }

    const formattedDate = new Date().toLocaleDateString("en-GB");
    const fullTicketNo = `PEM${String(ticketNumber).padStart(2, '0')}/${formattedDate}`;

    // Save to MongoDB
    const ticket = new Ticket({
      name,
      mobile,
      email,
      category,
      ticketNo: fullTicketNo,
    });

    await ticket.save();

    // Render EJS with ticketNo
    const templatePath = path.join(__dirname, "../templates/ticket.ejs");

    ejs.renderFile(
      templatePath,
      { name, mobile, email, category, base64Image, ticketNo: fullTicketNo },
      (err, html) => {
        if (err) {
          console.error("EJS render error:", err);
          return res.status(500).send("Template error");
        }

        pdf.create(html).toBuffer((err, buffer) => {
          if (err) {
            console.error("PDF error:", err);
            return res.status(500).send("PDF generation failed");
          }

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
              return res.status(500).send("Failed to send email. Please try again.");
            }

            console.log("Email sent: ", info.response);
            res.status(200).send("Ticket submitted and emailed.");
          });
        });
      }
    );
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
