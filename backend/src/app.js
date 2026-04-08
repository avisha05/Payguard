const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

require("./models/Transaction");

app.use(express.json());

// routes

app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.get("/", (req, res) => {
  res.send("PayGuard Backend Running");
});

module.exports = app;
