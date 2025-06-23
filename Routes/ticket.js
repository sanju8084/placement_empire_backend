const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const pdf = require("html-pdf");
const nodemailer = require("nodemailer");

const imagePath = path.join(__dirname, "../public/logo.png");
const base64Image = fs.existsSync(imagePath) ? fs.readFileSync(imagePath).toString("base64") : "";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/", upload.single("screenshot"), async (req, res) => {
  try {
    const { name, mobile, email, category, price } = req.body;

    const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });
    const lastNo = lastTicket?.ticketNo?.match(/\d+/)?.[0] || "0";
    const ticketNo = `PEM${String(+lastNo + 1).padStart(2, '0')}/${new Date().toLocaleDateString("en-GB")}`;
    const paymentStatus = req.file ? "Done" : "Not Done";

    const ticket = new Ticket({
      name,
      mobile,
      email,
      category,
      price,
      ticketNo,
      paymentStatus,
      screenshot: req.file?.filename,
    });

    await ticket.save();

    const templatePath = path.join(__dirname, "../templates/ticket.ejs");

    ejs.renderFile(templatePath, {
      name, mobile, email, category, base64Image,
      ticketNo, price, paymentStatus
    }, (err, html) => {
      if (err) return res.status(500).send("Template error");

      pdf.create(html).toBuffer((err, buffer) => {
        if (err) return res.status(500).send("PDF generation failed");

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your Event Ticket - Placement Empire",
          text: "Thanks for joining. Ticket attached.",
          attachments: [{
            filename: "ticket.pdf",
            content: buffer,
          }],
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) return res.status(500).send("Email failed");
          res.status(200).send("Ticket submitted");
        });
      });
    });
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

module.exports = router;
