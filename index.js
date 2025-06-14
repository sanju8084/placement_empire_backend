const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = 5000;

// DB Connect
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tickets", require("./Routes/ticket"));

// Start Server
app.listen(PORT, () => {
  console.log(` Server running on port:${PORT}`);
});
