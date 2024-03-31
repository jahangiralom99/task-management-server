const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const httpStatus = require("http-status");

const port = process.env.PORT || 8000;

// Middleware configuration
app.use(cors());

// body pars
app.use(express.json());

// Route call
app.get("/", (req, res) => {
  res.send(
    `<h1 style="color:#242B2E;font-size:62px; text-align:center;margin-top:200px">Welcome to Task server</h1>`
  );
});

// Handle Not Found Route
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "API NOT FOUND",
      },
    ],
  });
  next();
});

// Start Server
app.listen(port, () => {
  console.log(`App is running on port http://localhost:${port}`);
});
