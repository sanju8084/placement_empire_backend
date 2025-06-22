const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;


// DB Connect
connectDB();

app.use(cors({ origin: '*' }));

app.use(express.json());

// Routes
app.use("/api/tickets", require("./Routes/ticket"));
// app.use("/api/payment", require("./Routes/payment"));
app.use("/api/admin", require("./Routes/admin"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
