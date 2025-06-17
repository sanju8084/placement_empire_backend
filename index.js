const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = 5000;


// DB Connect
connectDB();

// Middlewares
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));
app.use(cors({ origin: '*' }));

app.use(express.json());

// Routes
app.use("/api/tickets", require("./Routes/ticket"));
// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
